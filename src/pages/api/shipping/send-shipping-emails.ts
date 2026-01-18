/** @format */

/**
 * API Route pour l'envoi automatique d'emails de confirmation d'expédition
 * Envoie les emails pour les commandes créées il y a 3 jours ou plus
 * Peut être appelée via cron (Vercel Cron) ou manuellement
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { AdminOrderService } from "@/services/dashboard/AdminOrderService";
import { SendgridEmailService } from "@/services/email/SendgridEmailService";

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
  processedCount?: number;
  details?: Array<{
    orderId: string;
    success: boolean;
    error?: string;
  }>;
};

/**
 * Génère un numéro de suivi unique
 */
function generateTrackingNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const randomDigits = Math.floor(100000 + Math.random() * 900000);

  return `TRK${year}${month}${day}${randomDigits}`;
}

/**
 * Vérifie si une date est un jour ouvrable (lundi-vendredi)
 */
function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  // 0 = Dimanche, 6 = Samedi
  return day !== 0 && day !== 6;
}

/**
 * Calcule la date de livraison estimée (3 jours ouvrables après aujourd'hui)
 */
function calculateEstimatedDeliveryDate(): Date {
  const date = new Date();
  const daysToAdd = 3;
  let businessDaysAdded = 0;

  while (businessDaysAdded < daysToAdd) {
    date.setDate(date.getDate() + 1);
    if (isBusinessDay(date)) {
      businessDaysAdded++;
    }
  }

  return date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Vérifier la méthode HTTP
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  // Vérifier l'authentification (pour les appels manuels, vous pouvez ajouter une vérification d'API key)
  const apiKey = req.headers["x-api-key"];
  if (process.env.CRON_SECRET && apiKey !== process.env.CRON_SECRET) {
    // Si CRON_SECRET est défini, on l'exige pour les appels manuels
    // Pour Vercel Cron, le secret est dans l'URL
    const cronSecret = req.query.secret;
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
  }

  try {
    console.log("🔵 [send-shipping-emails] Début du processus d'envoi automatique...");

    const adminOrderService = new AdminOrderService();

    // Récupérer les commandes prêtes à être expédiées (PAID, créées il y a 3 jours ou plus)
    const ordersReadyToShip = await adminOrderService.getOrdersReadyToShip();

    console.log(
      `🔵 [send-shipping-emails] ${ordersReadyToShip.length} commande(s) prête(s) à être expédiée(s)`
    );

    if (ordersReadyToShip.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucune commande à expédier",
        processedCount: 0
      });
    }

    const results: Array<{ orderId: string; success: boolean; error?: string }> = [];
    const estimatedDeliveryDate = calculateEstimatedDeliveryDate();
    const deliveryDateFormatted = estimatedDeliveryDate.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    // Initialiser SendgridEmailService
    const sendgridService = new SendgridEmailService();

    if (!sendgridService.isConfigured()) {
      return res.status(500).json({
        success: false,
        error: "Sendgrid n'est pas configuré. Vérifiez SENDGRID_API_KEY et SENDGRID_FROM_EMAIL."
      });
    }

    // Traiter chaque commande
    for (const order of ordersReadyToShip) {
      try {
        // Générer un numéro de suivi
        const trackingNumber = generateTrackingNumber();

        // Marquer la commande comme expédiée
        await adminOrderService.markOrderAsShipped(
          order.id,
          trackingNumber,
          estimatedDeliveryDate
        );

        console.log(
          `🔵 [send-shipping-emails] Commande ${order.id} marquée comme expédiée (tracking: ${trackingNumber})`
        );

        // Préparer les données pour l'email
        const customerName = order.metadata?.customerName || "Client";
        const items = order.items.map((item) => ({
          name: item.name || "Produit",
          quantity: item.quantity || 1,
          price: item.price || 0
        }));

        // Envoyer l'email de confirmation d'expédition via Sendgrid
        const emailResult = await sendgridService.sendShippingConfirmationEmail({
          orderId: order.id,
          customerName,
          customerEmail: order.userEmail,
          trackingNumber,
          estimatedDeliveryDate: deliveryDateFormatted,
          items,
          totalAmount: order.totalAmount || 0,
          currency: order.currency || "eur"
        });

        if (!emailResult.success) {
          throw new Error(emailResult.error || "Erreur lors de l'envoi de l'email");
        }

        // Marquer l'email comme envoyé
        await adminOrderService.markShippingEmailSent(order.id);

        console.log(
          `✅ [send-shipping-emails] Email d'expédition envoyé pour la commande ${order.id}`
        );

        results.push({
          orderId: order.id,
          success: true
        });
      } catch (error) {
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? String(error.message)
            : "Erreur inconnue";
        console.error(
          `❌ [send-shipping-emails] Erreur pour la commande ${order.id}:`,
          errorMessage
        );

        results.push({
          orderId: order.id,
          success: false,
          error: errorMessage
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(
      `✅ [send-shipping-emails] Processus terminé: ${successCount} succès, ${failureCount} échec(s)`
    );

    return res.status(200).json({
      success: true,
      message: `Traitement terminé: ${successCount} email(s) envoyé(s), ${failureCount} échec(s)`,
      processedCount: ordersReadyToShip.length,
      details: results
    });
  } catch (error) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Erreur inconnue";
    console.error("❌ [send-shipping-emails] Erreur globale:", errorMessage);

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

