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

// Désactive le parsing automatique du body pour Stripe
export const config = {
  api: {
    bodyParser: false
  }
};

// Fonction pour lire le body brut
async function getRawBody(req: NextApiRequest): Promise<string> {
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
}

type ResponseData = {
  received?: boolean;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
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
    const bodyString = await getRawBody(req);

    event = stripe.webhooks.constructEvent(
      bodyString,
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
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Construction des données du webhook
      const webhookData: StripeWebhookData = {
        sessionId: paymentIntent.id, // Utilise l'ID du Payment Intent comme sessionId
        customerEmail: paymentIntent.receipt_email || paymentIntent.metadata?.userEmail || null,
        amountTotal: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentStatus: "PAID",
        metadata: paymentIntent.metadata as Record<string, string> | undefined
      };

      // Traitement du paiement via le gestionnaire
      const paymentManager = PaymentFactory.createPaymentManager();
      const result = await paymentManager.handlePaymentWebhook(webhookData);

      if (!result.success) {
        const errorResponse = ErrorHandler.handleError(
          new WebhookError(result.error || "Erreur lors du traitement du paiement", "WEBHOOK_PROCESS_ERROR", 500, {
            sessionId: webhookData.sessionId,
            orderId: result.orderId
          }),
          {
            endpoint: "/api/webhooks/stripe",
            operation: "handlePaymentWebhook",
            eventType: event.type
          }
        );

        return res.status(errorResponse.statusCode).json({
          error: errorResponse.error,
          code: errorResponse.code,
          details: errorResponse.details
        });
      }

      console.log(`✅ Paiement traité avec succès pour la commande: ${result.orderId}`);
    } catch (error) {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
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
      const session = event.data.object as Stripe.Checkout.Session;

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
        const errorResponse = ErrorHandler.handleError(
          new WebhookError(result.error || "Erreur lors du traitement du paiement", "WEBHOOK_PROCESS_ERROR", 500, {
            sessionId: webhookData.sessionId,
            orderId: result.orderId
          }),
          {
            endpoint: "/api/webhooks/stripe",
            operation: "handlePaymentWebhook",
            eventType: event.type
          }
        );

        return res.status(errorResponse.statusCode).json({
          error: errorResponse.error,
          code: errorResponse.code,
          details: errorResponse.details
        });
      }

      console.log(`✅ Paiement traité avec succès pour la commande: ${result.orderId}`);
    } catch (error) {
      const session = event.data.object as Stripe.Checkout.Session;
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

