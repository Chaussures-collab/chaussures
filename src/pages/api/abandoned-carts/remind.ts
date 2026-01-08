/** @format */

import type { NextApiRequest, NextApiResponse } from "next";
import { AbandonedCartService } from "@/services/cart/AbandonedCartService";
import { emailService } from "@/services/email/EmailService";

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
  cartsReminded?: number;
};

/**
 * API endpoint pour relancer les paniers abandonnés
 * Cette route doit être appelée par un cron job ou une fonction planifiée
 * Exemple : toutes les 24 heures
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  // Vérifier que c'est une requête autorisée (avec une clé secrète par exemple)
  const authKey = req.headers["x-api-key"] || req.query.key;
  const expectedKey = process.env.ABANDONED_CART_API_KEY;

  if (expectedKey && authKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: "Non autorisé"
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Méthode non autorisée"
    });
  }

  try {
    const abandonedCartService = new AbandonedCartService();

    // Récupérer les paniers à relancer (abandonnés depuis plus de 24h)
    const hoursThreshold = Number(req.query.hours) || 24;
    const cartsToRemind = await abandonedCartService.getCartsToRemind(hoursThreshold);

    if (cartsToRemind.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucun panier à relancer",
        cartsReminded: 0
      });
    }

    // Envoyer les emails de relance
    let remindedCount = 0;
    for (const cart of cartsToRemind) {
      try {
        if (cart.userEmail && cart.items.length > 0) {
          const itemsList = cart.items
            .map((item) => `- ${item.nom} (x${item.quantity}) : €${item.prix.toFixed(2)}`)
            .join("\n");

          const cartUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://snipersmarket.com"}/cart`;

          await emailService.sendEmail({
            to: cart.userEmail,
            subject: "🛒 Vous avez des articles dans votre panier",
            html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Relance panier abandonné</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🛒 Vous avez des articles dans votre panier</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p>Bonjour,</p>
    
    <p>Nous avons remarqué que vous avez laissé des articles dans votre panier. Ne les manquez pas !</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #667eea;">Vos articles :</h2>
      <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
      <p style="font-size: 18px; font-weight: bold; color: #667eea; margin-top: 15px;">
        Total : €${cart.total.toFixed(2)}
      </p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${cartUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
        Finaliser ma commande
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      Cordialement,<br>
      L'équipe SnipersMarket
    </p>
  </div>
</body>
</html>
            `,
            text: `
Vous avez des articles dans votre panier

Bonjour,

Nous avons remarqué que vous avez laissé des articles dans votre panier. Ne les manquez pas !

Vos articles :
${itemsList}

Total : €${cart.total.toFixed(2)}

Finaliser ma commande : ${cartUrl}

Cordialement,
L'équipe SnipersMarket
            `
          });

          // Marquer le panier comme relancé
          if (cart.id) {
            await abandonedCartService.markReminderSent(cart.id);
          }

          remindedCount++;
        }
      } catch (error) {
        console.error(`Erreur lors de la relance du panier ${cart.id}:`, error);
      }
    }

    return res.status(200).json({
      success: true,
      message: `${remindedCount} panier(s) relancé(s) avec succès`,
      cartsReminded: remindedCount
    });
  } catch (error) {
    console.error("Erreur lors de la relance des paniers:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur serveur"
    });
  }
}

