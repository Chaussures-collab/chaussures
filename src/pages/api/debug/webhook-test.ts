/**
 * Endpoint de diagnostique pour les webhooks Stripe
 * Permet de tester et déboguer les webhooks directement
 * 
 * Usage: curl -X POST http://localhost:3000/api/debug/webhook-test \
 *   -H "Content-Type: application/json" \
 *   -d '{"test": "data"}'
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentFactory } from "@/services/payment/PaymentFactory";
import { StripeWebhookData } from "@/types/payment.types";

type ResponseData = {
  status: string;
  message: string;
  config?: {
    hasStripeSecret: boolean;
    hasWebhookSecret: boolean;
    stripeSecretKeyLength?: number;
    webhookSecretLength?: number;
  };
  testResult?: {
    orderId?: string;
    error?: string;
    details?: Record<string, unknown>;
  };
  logs?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  const logs: string[] = [];

  try {
    logs.push("🔍 [Debug Webhook] Démarrage du diagnostic");

    // Vérifier la configuration
    const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY;
    const hasWebhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
    const stripeSecretKeyLength = process.env.STRIPE_SECRET_KEY?.length || 0;
    const webhookSecretLength = process.env.STRIPE_WEBHOOK_SECRET?.length || 0;

    logs.push(
      `📋 Configuration:`,
      `  - STRIPE_SECRET_KEY: ${hasStripeSecret ? "✅ Configuré" : "❌ MANQUANT"} (${stripeSecretKeyLength} chars)`,
      `  - STRIPE_WEBHOOK_SECRET: ${hasWebhookSecret ? "✅ Configuré" : "❌ MANQUANT"} (${webhookSecretLength} chars)`
    );

    if (!hasStripeSecret || !hasWebhookSecret) {
      logs.push("❌ Les clés Stripe ne sont pas configurées!");
      return res.status(400).json({
        status: "error",
        message: "Configuration Stripe manquante",
        config: {
          hasStripeSecret,
          hasWebhookSecret,
          stripeSecretKeyLength,
          webhookSecretLength
        },
        logs
      });
    }

    logs.push("\n🔍 Vérification Firebase:");
    try {
      const { adminDb, isInitialized } = await import("@/config/firebase-admin");
      logs.push(
        `  - Firebase Admin: ${isInitialized ? "✅ Initialisé" : "❌ Pas initialisé"}`,
        `  - adminDb: ${adminDb ? "✅ Disponible" : "❌ Pas disponible"}`
      );
    } catch (fbError) {
      logs.push(`  - ❌ Erreur Firebase: ${fbError instanceof Error ? fbError.message : "Unknown error"}`);
    }

    // Test avec les données du test Stripe
    logs.push("\n🔍 Test de traitement des données:");

    const testWebhookData: StripeWebhookData = {
      sessionId: "pi_3Sq1qQCyUBFsH1Vq1TxZijE1",
      customerEmail: "test@example.com",
      amountTotal: 2000,
      currency: "eur",
      paymentStatus: "PAID",
      metadata: {
        userId: "test-user-123",
        userEmail: "test@example.com",
        totalAmount: "20",
        itemsJson: JSON.stringify([
          {
            id: "prod-123",
            name: "Test Product",
            price: 20,
            quantity: 1
          }
        ])
      }
    };

    logs.push(
      `  - Données de test créées`,
      `  - sessionId: ${testWebhookData.sessionId}`,
      `  - userId: ${testWebhookData.metadata?.userId}`,
      `  - Montant: ${testWebhookData.amountTotal ? testWebhookData.amountTotal / 100 : 0}€`
    );

    // Créer et tester le PaymentManager
    logs.push(
      "\n🔍 Traitement du webhook:",
      `  - PaymentManager créé`
    );
    const paymentManager = PaymentFactory.createPaymentManager();

    const result = await paymentManager.handlePaymentWebhook(testWebhookData);
    logs.push(
      `  - Résultat: ${result.success ? "✅ Succès" : "❌ Erreur"}`,
      `  - orderId: ${result.orderId || "N/A"}`,
      `  - message: ${result.message || "N/A"}`
    );

    return res.status(200).json({
      status: result.success ? "success" : "error",
      message: result.message || (result.success ? "Test réussi" : "Test échoué"),
      config: {
        hasStripeSecret,
        hasWebhookSecret,
        stripeSecretKeyLength,
        webhookSecretLength
      },
      testResult: {
        orderId: result.orderId,
        error: result.error
      },
      logs
    });
  } catch (error) {
    logs.push(`❌ Erreur: ${error instanceof Error ? error.message : "Unknown error"}`);
    if (error instanceof Error && error.stack) {
      logs.push(`Stack: ${error.stack}`);
    }

    return res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : "Unknown error",
      logs
    });
  }
}
