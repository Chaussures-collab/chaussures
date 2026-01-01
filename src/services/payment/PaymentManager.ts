/** @format */

/**
 * Gestionnaire de paiement - Orchestrateur principal
 * Respect du principe : Single Responsibility Principle (SRP)
 * Responsabilité unique : orchestrer les différents services de paiement
 * Respect du principe : Dependency Inversion Principle (DIP)
 * Dépend d'interfaces, pas d'implémentations concrètes
 */

import { IPaymentService } from "./interfaces/IPaymentService";
import { IOrderService } from "./interfaces/IOrderService";
import { IValidationService } from "./interfaces/IValidationService";
import {
  CreatePaymentSessionRequest,
  PaymentSessionResult,
  PaymentProcessResult,
  StripeWebhookData,
  PaymentItem
} from "@/types/payment.types";
import { PaymentError } from "./errors/PaymentError";
import { ErrorHandler } from "./errors/ErrorHandler";
import { emailService, OrderEmailData } from "../email/EmailService";

export class PaymentManager {
  constructor(
    private paymentService: IPaymentService,
    private orderService: IOrderService,
    private validationService: IValidationService
  ) {}

  /**
   * Crée une session de paiement
   * La commande sera créée uniquement après le paiement réussi (via webhook)
   */
  async initiatePayment(
    request: CreatePaymentSessionRequest
  ): Promise<PaymentSessionResult> {
    try {
      // Validation des données
      this.validationService.validatePaymentRequest(request);

      // Calcul du total
      const totalAmount = request.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Création de la session de paiement avec les métadonnées nécessaires
      // On stocke les données de commande dans les métadonnées Stripe
      // La commande sera créée uniquement après le paiement réussi via webhook
      const sessionResult = await this.paymentService.createPaymentSession({
        ...request,
        metadata: {
          ...request.metadata,
          userId: request.userId,
          userEmail: request.userEmail,
          totalAmount: totalAmount.toString(),
          itemsCount: request.items.length.toString()
        }
      });

      if (!sessionResult.success) {
        return sessionResult;
      }

      return sessionResult;
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "initiatePayment", userId: request.userId }
      );

      // Si c'est déjà une PaymentError, on la propage
      if (error instanceof PaymentError) {
        throw error;
      }

      // Sinon, on crée une erreur générique
      throw new PaymentError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'initiation du paiement",
        "PAYMENT_INITIATION_ERROR",
        500,
        { userId: request.userId }
      );
    }
  }

  /**
   * Traite un paiement validé via webhook
   * Crée la commande uniquement après le paiement réussi
   */
  async handlePaymentWebhook(
    webhookData: StripeWebhookData
  ): Promise<PaymentProcessResult> {
    try {
      // Traitement du paiement via le service de paiement
      const paymentResult = await this.paymentService.processPayment(
        webhookData.sessionId
      );

      // Si le paiement a réussi, on crée la commande
      if (paymentResult.success && webhookData.metadata) {
        const userId = webhookData.metadata.userId;
        const userEmail = webhookData.metadata.userEmail || webhookData.customerEmail || "";
        const totalAmount = parseFloat(webhookData.metadata.totalAmount || "0");

        if (!userId) {
          throw ErrorHandler.createWebhookError(
            "ID utilisateur manquant dans les métadonnées",
            webhookData.paymentStatus,
            { sessionId: webhookData.sessionId, metadata: webhookData.metadata }
          );
        }

        // Récupération des items depuis les métadonnées Stripe
        let items: PaymentItem[] = [];
        try {
          if (webhookData.metadata.itemsJson) {
            const parsedItems = JSON.parse(webhookData.metadata.itemsJson);
            // Validation et conversion en PaymentItem[]
            if (Array.isArray(parsedItems)) {
              items = parsedItems.map((item: unknown) => {
                if (
                  typeof item === "object" &&
                  item !== null &&
                  "id" in item &&
                  "name" in item &&
                  "price" in item &&
                  "quantity" in item
                ) {
                  return {
                    id: String(item.id),
                    name: String(item.name),
                    price: Number(item.price),
                    quantity: Number(item.quantity),
                    description: "description" in item ? String(item.description) : undefined,
                    imageUrl: "imageUrl" in item ? String(item.imageUrl) : undefined
                  } as PaymentItem;
                }
                return null;
              }).filter((item): item is PaymentItem => item !== null);
            }
          }
        } catch (error) {
          ErrorHandler.logError(
            error instanceof Error ? error : new Error("Erreur parsing items"),
            { operation: "parseItemsFromMetadata", sessionId: webhookData.sessionId }
          );
          // On continue même si on ne peut pas parser les items
        }

        // Création de la commande avec le statut PAID
        const orderId = await this.orderService.createOrder({
          userId,
          userEmail,
          items,
          totalAmount: webhookData.amountTotal ? webhookData.amountTotal / 100 : totalAmount, // Conversion des centimes
          currency: webhookData.currency || "eur",
          status: "PAID",
          paymentMethod: "STRIPE",
          stripeSessionId: webhookData.sessionId,
          metadata: webhookData.metadata
        });

        // Envoi des emails de notification (client et admin)
        try {
          await this.sendOrderEmails({
            orderId,
            userEmail,
            items,
            totalAmount: webhookData.amountTotal ? webhookData.amountTotal / 100 : totalAmount,
            currency: webhookData.currency || "eur",
            paymentMethod: "STRIPE",
            metadata: webhookData.metadata
          });
        } catch (emailError) {
          // On log l'erreur mais on ne fait pas échouer le paiement si l'email échoue
          ErrorHandler.logError(
            emailError instanceof Error ? emailError : new Error("Erreur envoi email"),
            { operation: "sendOrderEmails", orderId }
          );
        }

        return {
          success: true,
          orderId,
          message: "Paiement validé et commande créée",
          error: undefined
        };
      }

      // Si le paiement a échoué
      return {
        success: false,
        message: paymentResult.message || "Paiement échoué",
        error: paymentResult.error
      };
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "handlePaymentWebhook", webhookData }
      );

      // Si c'est déjà une PaymentError, on la propage
      if (error instanceof PaymentError) {
        throw error;
      }

      // Sinon, on crée une erreur de webhook
      throw ErrorHandler.createWebhookError(
        error instanceof Error
          ? error.message
          : "Erreur lors du traitement du webhook",
        webhookData.paymentStatus,
        {
          sessionId: webhookData.sessionId,
          originalError: error instanceof Error ? error.message : String(error)
        }
      );
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async checkPaymentStatus(sessionId: string): Promise<PaymentProcessResult> {
    try {
      return await this.paymentService.verifyPaymentStatus(sessionId);
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "checkPaymentStatus", sessionId }
      );

      // Si c'est déjà une PaymentError, on la propage
      if (error instanceof PaymentError) {
        throw error;
      }

      // Sinon, on crée une erreur générique
      throw new PaymentError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la vérification du statut",
        "PAYMENT_STATUS_CHECK_ERROR",
        500,
        { sessionId }
      );
    }
  }

  /**
   * Envoie les emails de notification après une commande
   * @private
   */
  private async sendOrderEmails(data: {
    orderId: string;
    userEmail: string;
    items: PaymentItem[];
    totalAmount: number;
    currency: string;
    paymentMethod: string;
    metadata?: Record<string, string>;
  }): Promise<void> {
    // Récupérer le nom du client depuis les métadonnées ou utiliser l'email
    const customerName =
      data.metadata?.nom && data.metadata?.prenom
        ? `${data.metadata.prenom} ${data.metadata.nom}`
        : data.metadata?.prenom || data.metadata?.nom || data.userEmail.split("@")[0] || "Client";

    const orderEmailData: OrderEmailData = {
      orderId: data.orderId,
      customerName,
      customerEmail: data.userEmail,
      items: data.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: data.totalAmount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      orderDate: new Date().toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    // Envoyer l'email de confirmation au client
    await emailService.sendOrderConfirmationEmail(orderEmailData);

    // Envoyer l'alerte à l'administrateur
    await emailService.sendAdminOrderAlert(orderEmailData);
  }
}

