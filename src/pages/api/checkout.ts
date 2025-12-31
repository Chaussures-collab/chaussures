/** @format */

/**
 * API Route pour créer une session de paiement
 * Utilise le système de paiement SOLID
 * Pages Router syntax
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { PaymentFactory } from "@/services/payment/PaymentFactory";
import { CreatePaymentSessionRequest } from "@/types/payment.types";
import { ErrorHandler } from "@/services/payment/errors/ErrorHandler";

type ResponseData = {
  url?: string;
  sessionId?: string;
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

  try {
    const { items, userId, userEmail } = req.body;

    // Validation des paramètres requis
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Les items du panier sont requis"
      });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        error: "L'ID utilisateur est requis"
      });
    }

    if (!userEmail || typeof userEmail !== "string") {
      return res.status(400).json({
        error: "L'email utilisateur est requis"
      });
    }

    // Construction de la requête
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const paymentRequest: CreatePaymentSessionRequest = {
      items,
      userId,
      userEmail,
      successUrl: `${baseUrl}/checkout/success`,
      cancelUrl: `${baseUrl}/checkout/cancels`,
      metadata: {}
    };

    // Création du gestionnaire de paiement et initiation du paiement
    const paymentManager = PaymentFactory.createPaymentManager();
    const result = await paymentManager.initiatePayment(paymentRequest);

    if (!result.success) {
      return res.status(500).json({
        error: result.error || "Erreur lors de la création du paiement"
      });
    }

    return res.status(200).json({
      url: result.url,
      sessionId: result.sessionId
    });
  } catch (error) {
    const errorResponse = ErrorHandler.handleError(error, {
      endpoint: "/api/checkout",
      method: req.method,
      body: req.body
    });

    return res.status(errorResponse.statusCode).json({
      error: errorResponse.error,
      code: errorResponse.code,
      details: errorResponse.details
    });
  }
}

