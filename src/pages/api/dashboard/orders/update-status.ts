/** @format */

/**
 * API Route pour mettre à jour le statut d'une commande
 * Permet de valider chaque étape du suivi
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { AdminOrderService } from "@/services/dashboard/AdminOrderService";
import { PaymentStatus } from "@/types/payment.types";

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        error: "orderId et status sont requis"
      });
    }

    // Valider le statut
    const validStatuses: PaymentStatus[] = [
      "PENDING",
      "PAID",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
      "SHIPPED",
      "DELIVERED"
    ];

    if (!validStatuses.includes(status as PaymentStatus)) {
      return res.status(400).json({
        success: false,
        error: `Statut invalide. Statuts valides: ${validStatuses.join(", ")}`
      });
    }

    console.log(
      `🔵 [update-status] Mise à jour du statut de la commande ${orderId} vers ${status}`
    );

    const adminOrderService = new AdminOrderService();

    // Vérifier que la commande existe
    const order = await adminOrderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Commande non trouvée"
      });
    }

    // Valider la transition de statut (workflow logique)
    const currentStatus = order.status;
    const validTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      PENDING: ["PAID", "FAILED", "CANCELLED"],
      PAID: ["SHIPPED", "CANCELLED", "REFUNDED"],
      SHIPPED: ["DELIVERED"],
      DELIVERED: [], // Statut final
      FAILED: ["PAID"], // Retry possible
      CANCELLED: [], // Statut final
      REFUNDED: [] // Statut final
    };

    if (
      validTransitions[currentStatus] &&
      !validTransitions[currentStatus].includes(status as PaymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        error: `Transition invalide: ${currentStatus} → ${status}. Transitions possibles: ${validTransitions[currentStatus].join(", ") || "Aucune"}`
      });
    }

    // Mettre à jour le statut
    await adminOrderService.updateOrderStatus(orderId, status as PaymentStatus);

    console.log(
      `✅ [update-status] Statut de la commande ${orderId} mis à jour: ${currentStatus} → ${status}`
    );

    const statusMessages: Record<PaymentStatus, string> = {
      PENDING: "Statut mis à jour: En attente",
      PAID: "Statut mis à jour: Payée",
      SHIPPED: "Statut mis à jour: Expédiée",
      DELIVERED: "Statut mis à jour: Livrée",
      FAILED: "Statut mis à jour: Échec",
      CANCELLED: "Statut mis à jour: Annulée",
      REFUNDED: "Statut mis à jour: Remboursée"
    };

    return res.status(200).json({
      success: true,
      message: statusMessages[status as PaymentStatus] || "Statut mis à jour avec succès"
    });
  } catch (error) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Erreur inconnue";
    console.error("❌ [update-status] Erreur:", errorMessage);

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

