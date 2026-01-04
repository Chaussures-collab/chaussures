/** @format */

import type { NextApiRequest, NextApiResponse } from "next";
import { AdminProductService } from "@/services/dashboard/AdminProductService";
import { AdminCategoryService } from "@/services/dashboard/AdminCategoryService";
import { AdminOrderService } from "@/services/dashboard/AdminOrderService";

type ResponseData = {
  success: boolean;
  stats?: {
    products: number;
    categories: number;
    orders: number;
    totalSales: number;
  };
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
    const productService = new AdminProductService();
    const categoryService = new AdminCategoryService();
    const orderService = new AdminOrderService();

    // Charger toutes les données en parallèle
    const [products, categories, orders] = await Promise.all([
      productService.getAllProducts(),
      categoryService.getAllCategories(),
      orderService.getAllOrders()
    ]);

    // Calculer le total des ventes (somme de totalAmount de toutes les commandes payées)
    const totalSales = orders
      .filter((order) => order.status === "PAID")
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      stats: {
        products: products.length,
        categories: categories.length,
        orders: orders.length,
        totalSales
      }
    });
  } catch (error) {
    console.error("Erreur lors du chargement des statistiques:", error);
    const errorMessage = error && typeof error === "object" && "message" in error 
      ? String(error.message) 
      : "Erreur inconnue";
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
}
