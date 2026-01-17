/** @format */

/**
 * Implémentation du service de paiement avec Stripe
 * Respect du principe : Single Responsibility Principle (SRP)
 * Responsabilité unique : gérer les paiements Stripe
 */

import { IPaymentService } from "../interfaces/IPaymentService";
import {
  CreatePaymentSessionRequest,
  PaymentSessionResult,
  PaymentProcessResult,
  PaymentStatus
} from "@/types/payment.types";
import { stripe } from "@/lib/stripe";
import { PaymentServiceError, NotFoundError } from "../errors/PaymentError";
import { ErrorHandler } from "../errors/ErrorHandler";
import Stripe from "stripe";

export class StripePaymentService implements IPaymentService {
  /**
   * Convertit une URL relative en URL absolue
   * Stripe nécessite des URLs absolues et valides pour les images
   */
  private normalizeImageUrl(imageUrl: string | undefined): string | undefined {
    if (!imageUrl) {
      return undefined;
    }

    // Si l'URL est déjà absolue (commence par http:// ou https://), on la retourne telle quelle
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      try {
        // Valide que c'est une URL valide
        new URL(imageUrl);
        return imageUrl;
      } catch {
        // Si l'URL n'est pas valide, on retourne undefined
        return undefined;
      }
    }

    // Si c'est une URL relative, on la convertit en URL absolue
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    try {
      const absoluteUrl = new URL(imageUrl, baseUrl).toString();
      return absoluteUrl;
    } catch {
      // Si la conversion échoue, on retourne undefined
      return undefined;
    }
  }

  async createPaymentSession(
    request: CreatePaymentSessionRequest
  ): Promise<PaymentSessionResult> {
    try {
      const lineItems = request.items.map((item) => {
        const normalizedImageUrl = this.normalizeImageUrl(item.imageUrl);
        
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              description: item.description,
              images: normalizedImageUrl ? [normalizedImageUrl] : undefined
            },
            unit_amount: Math.round(item.price * 100) // Conversion en centimes
          },
          quantity: item.quantity
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
        // customer_email: request.userEmail,
        metadata: {
          userId: request.userId,
          ...request.metadata
        }
      });

      if (!session.url) {
        return {
          success: false,
          error: "Impossible de créer l'URL de paiement"
        };
      }

      return {
        success: true,
        sessionId: session.id,
        url: session.url
      };
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "createPaymentSession", userId: request.userId }
      );

      // Gestion des erreurs Stripe spécifiques
      if (error instanceof Stripe.errors.StripeError) {
        const stripeError = error as Stripe.errors.StripeError;
        throw ErrorHandler.createPaymentServiceError(
          `Erreur Stripe: ${stripeError.message}`,
          stripeError.type || "STRIPE_ERROR",
          {
            code: stripeError.code,
            type: stripeError.type,
            declineCode: (stripeError as Stripe.errors.StripeCardError).decline_code,
            param: (stripeError as Stripe.errors.StripeInvalidRequestError).param
          }
        );
      }

      throw ErrorHandler.createPaymentServiceError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création de la session de paiement",
        "STRIPE_SESSION_ERROR",
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async processPayment(
    sessionId: string
  ): Promise<PaymentProcessResult> {
    try {
      // Essayer d'abord comme Payment Intent (nouveau système)
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(sessionId);
        
        if (paymentIntent.status === "succeeded") {
          return {
            success: true,
            message: "Paiement validé"
          };
        }
        
        return {
          success: false,
          message: `Paiement échoué: ${paymentIntent.status}`
        };
      } catch (paymentIntentError) {
        // Si ce n'est pas un Payment Intent, essayer comme Checkout Session
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);

          if (!session) {
            throw new NotFoundError("Session de paiement introuvable", {
              sessionId
            });
          }

          const status: PaymentStatus =
            session.payment_status === "paid" ? "PAID" : "FAILED";

          return {
            success: status === "PAID",
            message: status === "PAID" ? "Paiement validé" : "Paiement échoué"
          };
        } catch (sessionError) {
          // Si les deux échouent, lever une erreur
          throw new NotFoundError("Session ou Payment Intent introuvable", {
            sessionId,
            paymentIntentError: paymentIntentError instanceof Error ? paymentIntentError.message : String(paymentIntentError),
            sessionError: sessionError instanceof Error ? sessionError.message : String(sessionError)
          });
        }
      }
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "processPayment", sessionId }
      );

      if (error instanceof PaymentServiceError || error instanceof NotFoundError) {
        throw error;
      }

      if (error instanceof Stripe.errors.StripeError) {
        const stripeError = error as Stripe.errors.StripeError;
        throw ErrorHandler.createPaymentServiceError(
          `Erreur Stripe lors du traitement: ${stripeError.message}`,
          stripeError.type || "STRIPE_PROCESS_ERROR",
          { code: stripeError.code, sessionId }
        );
      }

      throw ErrorHandler.createPaymentServiceError(
        error instanceof Error
          ? error.message
          : "Erreur lors du traitement du paiement",
        "PAYMENT_PROCESS_ERROR",
        { sessionId, originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async verifyPaymentStatus(sessionId: string): Promise<PaymentProcessResult> {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (!session) {
        throw new NotFoundError("Session de paiement introuvable", {
          sessionId
        });
      }

      const status: PaymentStatus =
        session.payment_status === "paid" ? "PAID" : "PENDING";

      return {
        success: status === "PAID",
        message:
          status === "PAID"
            ? "Paiement confirmé"
            : "Paiement en attente de confirmation"
      };
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "verifyPaymentStatus", sessionId }
      );

      if (error instanceof PaymentServiceError || error instanceof NotFoundError) {
        throw error;
      }

      if (error instanceof Stripe.errors.StripeError) {
        const stripeError = error as Stripe.errors.StripeError;
        throw ErrorHandler.createPaymentServiceError(
          `Erreur Stripe lors de la vérification: ${stripeError.message}`,
          stripeError.type || "STRIPE_VERIFY_ERROR",
          { code: stripeError.code, sessionId }
        );
      }

      throw ErrorHandler.createPaymentServiceError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la vérification du paiement",
        "PAYMENT_VERIFY_ERROR",
        { sessionId, originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}

