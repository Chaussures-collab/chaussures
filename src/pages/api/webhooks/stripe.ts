/** @format */

/**
 * Webhook Stripe prêt pour Vercel prod
 * ⚡ Utilise Node.js runtime et buffer pour body brut
 */

import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { PaymentFactory } from "@/services/payment/PaymentFactory";
import { StripeWebhookData, PaymentStatus } from "@/types/payment.types";
import { ErrorHandler } from "@/services/payment/errors/ErrorHandler";
import { WebhookError } from "@/services/payment/errors/PaymentError";
import { buffer } from "micro";

// 🔹 Forcer Node.js runtime (très important pour Stripe)
export const runtime = "nodejs";

// 🔹 Config API pour désactiver parsing automatique + exclure middleware global
export const config = {
  api: {
    bodyParser: false
  },
  matcher: ["/((?!api/webhooks/stripe).*)"] // exclut le webhook si middleware global
};

type ResponseData = {
  received?: boolean;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
  orderId?: string;
  message?: string;
};

// Liste pour suivre les Payment Intents déjà traités (idempotence simple)
const processedPaymentIntents = new Set<string>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const signature = req.headers["stripe-signature"] as string;
  if (!signature) {
    return res.status(400).json({ error: "Signature manquante" });
  }

  let event: Stripe.Event;

  try {
    // 🔹 Récupération du body brut (Buffer)
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

    return res.status(400).json({
      error: errorResponse.error,
      code: errorResponse.code,
      details: errorResponse.details
    });
  }

  try {
    // 🔹 Gestion Payment Intent
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // ⚡ Idempotence : éviter de traiter 2 fois le même Payment Intent
      if (processedPaymentIntents.has(paymentIntent.id)) {
        return res.status(200).json({ received: true, message: "Déjà traité" });
      }
      processedPaymentIntents.add(paymentIntent.id);

      const webhookData: StripeWebhookData = {
        sessionId: paymentIntent.id,
        customerEmail:
          paymentIntent.receipt_email ||
          paymentIntent.metadata?.userEmail ||
          null,
        amountTotal: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentStatus: "PAID",
        metadata: paymentIntent.metadata as Record<string, string> | undefined
      };

      const paymentManager = PaymentFactory.createPaymentManager();
      const result = await paymentManager.handlePaymentWebhook(webhookData);

      if (!result.success) {
        const errorResponse = ErrorHandler.handleError(
          new WebhookError(
            result.error || "Erreur lors du traitement du paiement",
            "WEBHOOK_PROCESS_ERROR",
            500,
            { sessionId: webhookData.sessionId, orderId: result.orderId }
          ),
          {
            endpoint: "/api/webhooks/stripe",
            operation: "handlePaymentWebhook",
            eventType: event.type
          }
        );
        return res.status(200).json({
          received: true,
          error: errorResponse.error,
          code: errorResponse.code,
          details: errorResponse.details,
          orderId: result.orderId
        });
      }

      return res.status(200).json({
        received: true,
        orderId: result.orderId,
        message: "Paiement traité avec succès"
      });
    }

    // 🔹 Gestion Checkout Session (ancien système)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const paymentStatus: PaymentStatus =
        session.payment_status === "paid" ? "PAID" : "FAILED";

      const webhookData: StripeWebhookData = {
        sessionId: session.id,
        customerEmail: session.customer_details?.email || null,
        amountTotal: session.amount_total,
        currency: session.currency,
        paymentStatus,
        metadata: session.metadata as Record<string, string> | undefined
      };

      const paymentManager = PaymentFactory.createPaymentManager();
      const result = await paymentManager.handlePaymentWebhook(webhookData);

      if (!result.success) {
        const errorResponse = ErrorHandler.handleError(
          new WebhookError(
            result.error || "Erreur lors du traitement du paiement",
            "WEBHOOK_PROCESS_ERROR",
            500,
            { sessionId: webhookData.sessionId, orderId: result.orderId }
          ),
          {
            endpoint: "/api/webhooks/stripe",
            operation: "handlePaymentWebhook",
            eventType: event.type
          }
        );
        return res.status(200).json({
          received: true,
          error: errorResponse.error,
          code: errorResponse.code,
          details: errorResponse.details
        });
      }

      return res.status(200).json({
        received: true,
        orderId: result.orderId,
        message: "Paiement traité avec succès"
      });
    }

    // 🔹 Autres événements non traités
    return res
      .status(200)
      .json({ received: true, message: "Événement ignoré" });
  } catch (err) {
    const errorResponse = ErrorHandler.handleError(err, {
      endpoint: "/api/webhooks/stripe",
      operation: "process_webhook_event"
    });
    return res.status(200).json({
      received: true,
      error: errorResponse.error,
      code: errorResponse.code,
      details: errorResponse.details
    });
  }
}
