/** @format */

/**
 * Webhook Stripe pour traiter les événements de paiement
 * Utilise le système de paiement SOLID
 * Pages Router syntax
 */

import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { PaymentFactory } from "@/services/payment/PaymentFactory";
import { StripeWebhookData, PaymentStatus } from "@/types/payment.types";
import { ErrorHandler } from "@/services/payment/errors/ErrorHandler";
import { WebhookError } from "@/services/payment/errors/PaymentError";
import { buffer } from "micro";

export const runtime = "nodejs";

// Désactive le parsing automatique du body pour Stripe
export const config = {
  matcher: ["/((?!api/webhooks/stripe).*)"],
  api: {
    bodyParser: false
  }
};

// Fonction pour lire le body brut
/* async function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk.toString();
    });
    req.on("end", () => {
      resolve(data);
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
} */

type ResponseData = {
  received?: boolean;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
  orderId?: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).json({ error: "Signature manquante" });
  }

  let event: Stripe.Event;

  try {
    // Récupération du body brut
    const rawBody = await buffer(req);

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

  } catch (err) {
    const errorResponse = ErrorHandler.handleError(err, {
      endpoint: "/api/webhooks/stripe",
      operation: "webhook_signature_verification"
    });

    return res.status(errorResponse.statusCode).json({
      error: errorResponse.error,
      code: errorResponse.code,
      details: errorResponse.details
    });
  }

  // Traitement des événements de paiement
  // Support pour Payment Intents (nouveau système)
  if (event.type === "payment_intent.succeeded") {
    try {
      console.log(`🔵 [Webhook] Event type: ${event.type}`);
      const paymentIntent = event.data.object;
      if (!paymentIntent.metadata?.itemsJson) {
        console.error(
          "❌ [Webhook] itemsJson manquant dans les métadonnées du Payment Intent"
        );
      }

      // Construction des données du webhook
      const webhookData: StripeWebhookData = {
        sessionId: paymentIntent.id, // Utilise l'ID du Payment Intent comme sessionId
        customerEmail:
          paymentIntent.receipt_email ||
          paymentIntent.metadata?.userEmail ||
          null,
        amountTotal: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentStatus: "PAID",
        metadata: paymentIntent.metadata as Record<string, string> | undefined
      };

      console.log(`🔵 [Webhook] WebhookData construite:`, {
        sessionId: webhookData.sessionId,
        customerEmail: webhookData.customerEmail,
        amountTotal: webhookData.amountTotal,
        paymentStatus: webhookData.paymentStatus,
        hasMetadata: !!webhookData.metadata
      });

      // Vérifier l'initialisation de l'Admin SDK
      try {
        const { adminDb } = await import("@/config/firebase-admin");
        if (adminDb) {
          console.log("✅ [Webhook] adminDb est initialisé");
        } else {
          console.error("❌ [Webhook] adminDb n'est pas initialisé");
        }
      } catch (adminError) {
        console.error(
          "❌ [Webhook] Erreur lors de la vérification de adminDb:",
          adminError
        );
      }

      // Traitement du paiement via le gestionnaire
      console.log(
        `🔵 [Webhook] Appel de PaymentManager.handlePaymentWebhook...`
      );
      const paymentManager = PaymentFactory.createPaymentManager();

      let result;
      try {
        result = await paymentManager.handlePaymentWebhook(webhookData);
        console.log(`🔵 [Webhook] Résultat de handlePaymentWebhook:`, result);
      } catch (handlerError) {
        console.error(
          `❌ [Webhook] Exception lors du handlePaymentWebhook:`,
          handlerError
        );
        const errorResponse = ErrorHandler.handleError(handlerError, {
          endpoint: "/api/webhooks/stripe",
          operation: "handlePaymentWebhook",
          eventType: event.type,
          sessionId: webhookData.sessionId
        });

        console.error(
          "❌ [Webhook] Erreur lors du traitement (exception non capturée):",
          errorResponse
        );
        return res.status(200).json({
          received: true,
          error: errorResponse.error,
          code: errorResponse.code,
          details: errorResponse.details
        });
      }

      if (!result.success) {
        console.error(
          `❌ Échec du traitement du paiement (Payment Intent): ${result.error}`
        );
        const errorResponse = ErrorHandler.handleError(
          new WebhookError(
            result.error || "Erreur lors du traitement du paiement",
            "WEBHOOK_PROCESS_ERROR",
            500,
            {
              sessionId: webhookData.sessionId,
              orderId: result.orderId
            }
          ),
          {
            endpoint: "/api/webhooks/stripe",
            operation: "handlePaymentWebhook",
            eventType: event.type
          }
        );

        // Retourner 200 pour éviter que Stripe réessaie indéfiniment
        // mais logger l'erreur pour investigation
        console.error(
          "❌ Erreur webhook (mais retour 200 pour éviter les retries):",
          errorResponse
        );
        return res.status(200).json({
          received: true,
          error: errorResponse.error,
          code: errorResponse.code,
          details: errorResponse.details,
          orderId: result.orderId
        });
      }

      console.log(
        `✅ Paiement traité avec succès pour la commande: ${result.orderId}`
      );
      return res.status(200).json({
        received: true,
        orderId: result.orderId,
        message: "Paiement traité avec succès"
      });
    } catch (error) {
      const paymentIntent = event.data.object;
      const errorResponse = ErrorHandler.handleError(error, {
        endpoint: "/api/webhooks/stripe",
        operation: "process_webhook_event",
        eventType: event.type,
        sessionId: paymentIntent?.id
      });

      return res.status(errorResponse.statusCode).json({
        error: errorResponse.error,
        code: errorResponse.code,
        details: errorResponse.details
      });
    }
  }

  // Support pour Checkout Sessions (ancien système - pour compatibilité)
  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      // Détermination du statut du paiement
      const paymentStatus: PaymentStatus =
        session.payment_status === "paid" ? "PAID" : "FAILED";

      // Construction des données du webhook
      const webhookData: StripeWebhookData = {
        sessionId: session.id,
        customerEmail: session.customer_details?.email || null,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus,
        metadata: session.metadata as Record<string, string> | undefined
      };

      // Traitement du paiement via le gestionnaire
      const paymentManager = PaymentFactory.createPaymentManager();
      const result = await paymentManager.handlePaymentWebhook(webhookData);

      if (!result.success) {
        console.error(
          `❌ Échec du traitement du paiement (Checkout Session): ${result.error}`
        );
        const errorResponse = ErrorHandler.handleError(
          new WebhookError(
            result.error || "Erreur lors du traitement du paiement",
            "WEBHOOK_PROCESS_ERROR",
            500,
            {
              sessionId: webhookData.sessionId,
              orderId: result.orderId
            }
          ),
          {
            endpoint: "/api/webhooks/stripe",
            operation: "handlePaymentWebhook",
            eventType: event.type
          }
        );

        // Retourner 200 pour éviter que Stripe réessaie indéfiniment
        // mais logger l'erreur pour investigation
        console.error(
          "❌ Erreur webhook (mais retour 200 pour éviter les retries):",
          errorResponse
        );
        return res.status(200).json({
          received: true,
          error: errorResponse.error,
          code: errorResponse.code,
          details: errorResponse.details
        });
      }

      console.log(
        `✅ Paiement traité avec succès pour la commande: ${result.orderId}`
      );
      return res.status(200).json({
        received: true,
        orderId: result.orderId,
        message: "Paiement traité avec succès"
      });
    } catch (error) {
      const session = event.data.object;
      const errorResponse = ErrorHandler.handleError(error, {
        endpoint: "/api/webhooks/stripe",
        operation: "process_webhook_event",
        eventType: event.type,
        sessionId: session?.id
      });

      return res.status(errorResponse.statusCode).json({
        error: errorResponse.error,
        code: errorResponse.code,
        details: errorResponse.details
      });
    }
  }

  return res.status(200).json({ received: true });
}

