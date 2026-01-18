/** @format */

/**
 * API Route pour récupérer les informations de suivi d'une commande
 * par son numéro de suivi
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { AdminOrderService } from "@/services/dashboard/AdminOrderService";

type ResponseData = {
  success: boolean;
  order?: {
    id: string;
    trackingNumber: string;
    status: string;
    userEmail: string;
    totalAmount: number;
    currency: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    createdAt: string;
    shippedAt?: string;
    estimatedDeliveryDate?: string;
  };
  tracking?: {
    status: string;
    currentLocation: string;
    estimatedDelivery: string;
    steps: Array<{
      status: string;
      label: string;
      description: string;
      date: string;
      completed: boolean;
    }>;
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {
    const { trackingNumber } = req.query;

    if (!trackingNumber || typeof trackingNumber !== "string") {
      return res.status(400).json({
        success: false,
        error: "Numéro de suivi requis"
      });
    }

    const adminOrderService = new AdminOrderService();
    const order = await adminOrderService.getOrderByTrackingNumber(trackingNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Commande non trouvée avec ce numéro de suivi"
      });
    }

    // Générer les étapes de suivi basées sur le statut et les dates
    const now = new Date();
    
    // Convertir shippedAt en Date
    let shippedAt: Date = now;
    if (order.shippedAt) {
      const shipped = order.shippedAt as Date | { toDate: () => Date } | string;
      if (shipped instanceof Date) {
        shippedAt = shipped;
      } else if (shipped && typeof shipped === "object" && "toDate" in shipped && typeof shipped.toDate === "function") {
        shippedAt = shipped.toDate();
      } else if (typeof shipped === "string") {
        shippedAt = new Date(shipped);
      }
    }

    // Convertir estimatedDeliveryDate en Date
    let estimatedDelivery: Date | null = null;
    if (order.estimatedDeliveryDate) {
      const estimated = order.estimatedDeliveryDate as Date | { toDate: () => Date } | string;
      if (estimated instanceof Date) {
        estimatedDelivery = estimated;
      } else if (estimated && typeof estimated === "object" && "toDate" in estimated && typeof estimated.toDate === "function") {
        estimatedDelivery = estimated.toDate();
      } else if (typeof estimated === "string") {
        estimatedDelivery = new Date(estimated);
      }
    }

    // Convertir createdAt en Date
    let createdAt: Date = now;
    if (order.createdAt) {
      if (order.createdAt instanceof Date) {
        createdAt = order.createdAt;
      } else if (typeof order.createdAt === "object" && order.createdAt && "toDate" in order.createdAt) {
        createdAt = (order.createdAt as { toDate: () => Date }).toDate();
      } else {
        createdAt = new Date(order.createdAt);
      }
    }

    // Simuler les étapes de suivi
    const steps = generateTrackingSteps(
      order.status,
      createdAt,
      shippedAt,
      estimatedDelivery || null
    );

    // Localisation actuelle simulée
    const currentLocation = getCurrentLocation(order.status, shippedAt);

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        trackingNumber: order.trackingNumber || "",
        status: order.status,
        userEmail: order.userEmail,
        totalAmount: order.totalAmount || 0,
        currency: order.currency || "eur",
        items: (order.items || []).map((item) => ({
          name: item.name || "Produit",
          quantity: item.quantity || 1,
          price: item.price || 0
        })),
        createdAt: createdAt.toISOString(),
        shippedAt: shippedAt.toISOString(),
        estimatedDeliveryDate: estimatedDelivery?.toISOString()
      },
      tracking: {
        status: order.status,
        currentLocation,
        estimatedDelivery: estimatedDelivery
          ? estimatedDelivery.toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })
          : "En cours de traitement",
        steps
      }
    });
  } catch (error) {
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String(error.message)
        : "Erreur inconnue";
    console.error("❌ [tracking] Erreur:", errorMessage);

    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}

/**
 * Génère les étapes de suivi basées sur le statut de la commande
 */
function generateTrackingSteps(
  status: string,
  createdAt: Date,
  shippedAt: Date,
  estimatedDelivery: Date | null
): Array<{
  status: string;
  label: string;
  description: string;
  date: string;
  completed: boolean;
}> {
  const steps = [];
  const now = new Date();

  // Étape 1: Commande confirmée
  steps.push({
    status: "confirmed",
    label: "Commande confirmée",
    description: "Votre commande a été confirmée et le paiement validé",
    date: createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    completed: true
  });

  // Étape 2: En préparation
  const preparationDate = new Date(createdAt);
  preparationDate.setHours(createdAt.getHours() + 2);
  steps.push({
    status: "preparation",
    label: "En préparation",
    description: "Votre commande est en cours de préparation dans notre entrepôt",
    date: preparationDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }),
    completed: status !== "PAID" || now >= preparationDate
  });

  // Étape 3: Expédiée
  if (status === "SHIPPED" || status === "DELIVERED") {
    steps.push({
      status: "shipped",
      label: "Expédiée",
      description: "Votre colis a quitté notre entrepôt et est en route",
      date: shippedAt.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      completed: true
    });

    // Étape 4: En transit
    const transitDate = new Date(shippedAt);
    transitDate.setDate(shippedAt.getDate() + 1);
    steps.push({
      status: "transit",
      label: "En transit",
      description: "Votre colis est en cours d'acheminement vers le centre de distribution",
      date: transitDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }),
      completed: status === "DELIVERED" || now >= transitDate
    });

    // Étape 5: Livraison
    if (estimatedDelivery) {
      steps.push({
        status: "delivery",
        label: "En cours de livraison",
        description: `Votre colis sera livré le ${estimatedDelivery.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric"
        })}`,
        date: estimatedDelivery.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }),
        completed: status === "DELIVERED"
      });
    }

    // Étape 6: Livrée
    if (status === "DELIVERED") {
      steps.push({
        status: "delivered",
        label: "Livrée",
        description: "Votre colis a été livré avec succès",
        date: now.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        completed: true
      });
    }
  }

  return steps;
}

/**
 * Simule la localisation actuelle du colis
 */
function getCurrentLocation(status: string, shippedAt: Date): string {
  if (status === "PAID") {
    return "Entrepôt - Paris, France";
  }
  if (status === "SHIPPED") {
    const daysSinceShipped = Math.floor(
      (Date.now() - shippedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceShipped === 0) {
      return "Centre de tri - Paris, France";
    }
    if (daysSinceShipped === 1) {
      return "Centre de distribution - Lyon, France";
    }
    return "En route vers votre domicile";
  }
  if (status === "DELIVERED") {
    return "Livré à votre domicile";
  }
  return "Entrepôt - Paris, France";
}

