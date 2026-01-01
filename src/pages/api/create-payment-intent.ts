/** @format */

/**
 * API Route pour créer un Payment Intent Stripe
 * Utilise Payment Intents au lieu de Checkout Sessions pour un paiement personnalisé
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "@/lib/stripe";
import { ErrorHandler } from "@/services/payment/errors/ErrorHandler";

type ResponseData = {
  clientSecret?: string;
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

    // Calcul du montant total en centimes
    const amount = items.reduce((total, item) => {
      return total + Math.round(item.price * 100) * item.quantity;
    }, 0);

    // Calcul du total pour les métadonnées
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Vérifier le statut du compte Stripe avant de créer le Payment Intent
    try {
      const account = await stripe.accounts.retrieve();
      
      // Vérifier si le compte est activé pour les paiements
      if (account.details_submitted === false || account.charges_enabled === false) {
        return res.status(402).json({
          error: "Votre compte Stripe n'est pas encore complètement activé pour les transactions. Veuillez compléter l'onboarding sur https://dashboard.stripe.com/account/onboarding",
          code: "account_not_activated",
          details: {
            details_submitted: account.details_submitted,
            charges_enabled: account.charges_enabled,
            onboarding_url: "https://dashboard.stripe.com/account/onboarding"
          }
        });
      }
    } catch (accountError) {
      // Si on ne peut pas récupérer le compte (compte connecté), on continue quand même
      // car l'erreur sera gérée par Stripe lors de la création du Payment Intent
      console.warn("Impossible de vérifier le statut du compte Stripe:", accountError);
    }

    // Création du Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      payment_method_types: ["card"], // Spécifier explicitement les types de paiement
      metadata: {
        userId,
        userEmail,
        itemsCount: items.length.toString(),
        totalAmount: totalAmount.toString(),
        itemsJson: JSON.stringify(items) // Stocker les items pour le webhook
      }
    });

    return res.status(200).json({
      clientSecret: paymentIntent.client_secret || undefined
    });
  } catch (error) {
    const errorResponse = ErrorHandler.handleError(error, {
      endpoint: "/api/create-payment-intent",
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

