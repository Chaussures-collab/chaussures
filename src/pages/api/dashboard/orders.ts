/** @format */

import type { NextApiRequest, NextApiResponse } from "next";
import { AdminOrderService, OrderDocument } from "@/services/dashboard/AdminOrderService";

type ResponseData = {
  success: boolean;
  orders?: OrderDocument[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const orderService = new AdminOrderService();
    const orders = await orderService.getAllOrders();

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("Erreur lors du chargement des commandes:", error);
    const errorMessage = error && typeof error === "object" && "message" in error 
      ? String(error.message) 
      : "Erreur inconnue";
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}
