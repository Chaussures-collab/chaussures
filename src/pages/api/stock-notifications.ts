/** @format */

import type { NextApiRequest, NextApiResponse } from "next";
import { StockNotificationService } from "@/services/stock/StockNotificationService";

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Méthode non autorisée"
    });
  }

  try {
    const { productId, productName, email } = req.body;

    if (!productId || !productName || !email) {
      return res.status(400).json({
        success: false,
        error: "Données manquantes (productId, productName, email requis)"
      });
    }

    const stockNotificationService = new StockNotificationService();
    await stockNotificationService.createNotification({
      productId: String(productId),
      productName,
      email
    });

    return res.status(200).json({
      success: true,
      message: "Notification enregistrée avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la création de la notification:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Erreur serveur"
    });
  }
}

