/** @format */

/**
 * API Route pour l'envoi manuel d'email de confirmation d'expédition
 * Permet à un admin d'expédier manuellement une commande
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { AdminOrderService } from "@/services/dashboard/AdminOrderService";
import { SendgridEmailService } from "@/services/email/SendgridEmailService";

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
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
 * Calcule la date de livraison estimée (jours ouvrables après aujourd'hui)
 */
function calculateEstimatedDeliveryDate(days: number = 3): Date {
  const date = new Date();
  let businessDaysAdded = 0;

  while (businessDaysAdded < days) {
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

  try {
    const { orderId, trackingNumber, estimatedDeliveryDays } = req.body;

    // Validation
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: "orderId est requis"
      });
    }

    console.log(`🔵 [manual-ship] Envoi manuel pour la commande ${orderId}`);

    const adminOrderService = new AdminOrderService();

    // Récupérer la commande
    const order = await adminOrderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Commande non trouvée"
      });
    }

    // Vérifier que la commande est payée
    if (order.status !== "PAID" && order.status !== "SHIPPED") {
      return res.status(400).json({
        success: false,
        error: `La commande doit être PAYED pour être expédiée (statut actuel: ${order.status})`
      });
    }

    // Générer ou utiliser le numéro de suivi fourni
    const finalTrackingNumber =
      trackingNumber || generateTrackingNumber();

    // Calculer la date de livraison estimée (jours ouvrables uniquement)
    const days = estimatedDeliveryDays || 3;
    const estimatedDeliveryDate = calculateEstimatedDeliveryDate(days);
    const deliveryDateFormatted = estimatedDeliveryDate.toLocaleDateString(
      "fr-FR",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

    // Initialiser SendgridEmailService
    const sendgridService = new SendgridEmailService();

    if (!sendgridService.isConfigured()) {
      return res.status(500).json({
        success: false,
        error: "Sendgrid n'est pas configuré. Vérifiez SENDGRID_API_KEY et SENDGRID_FROM_EMAIL."
      });
    }

    // Marquer la commande comme expédiée
    await adminOrderService.markOrderAsShipped(
      orderId,
      finalTrackingNumber,
      estimatedDeliveryDate
    );

    console.log(
      `🔵 [manual-ship] Commande ${orderId} marquée comme expédiée (tracking: ${finalTrackingNumber})`
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
          trackingNumber: finalTrackingNumber,
          estimatedDeliveryDate: deliveryDateFormatted,
          items,
          totalAmount: order.totalAmount || 0,
          currency: order.currency || "eur"
        });

        if (!emailResult.success) {
          throw new Error(emailResult.error || "Erreur lors de l'envoi de l'email");
        }

    // Marquer l'email comme envoyé
    await adminOrderService.markShippingEmailSent(orderId);

    console.log(
      `✅ [manual-ship] Email d'expédition envoyé pour la commande ${orderId}`
    );

    return res.status(200).json({
      success: true,
      message: "Commande expédiée et email envoyé avec succès",
      trackingNumber: finalTrackingNumber,
      estimatedDeliveryDate: deliveryDateFormatted
    });
  } catch (error) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Erreur inconnue";
    console.error("❌ [manual-ship] Erreur:", errorMessage);

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

