/** @format */

import { adminDb } from "@/config/firebase-admin";
import { OrderData, PaymentStatus } from "@/types/payment.types";
import * as admin from "firebase-admin";

const ORDERS_COLLECTION = "orders";

export interface OrderDocument extends Omit<OrderData, "createdAt" | "updatedAt"> {
  id: string;
  createdAt: Date | admin.firestore.Timestamp;
  updatedAt: Date | admin.firestore.Timestamp;
}

export class AdminOrderService {
  // Récupérer toutes les commandes
  async getAllOrders(): Promise<OrderDocument[]> {
    try {
      const snapshot = await adminDb.collection(ORDERS_COLLECTION).orderBy("createdAt", "desc").get();
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt || new Date()
        } as OrderDocument;
      });
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(orderId: string, status: PaymentStatus): Promise<boolean> {
    try {
      const now = admin.firestore.Timestamp.now();
      await adminDb.collection(ORDERS_COLLECTION).doc(orderId).update({
        status,
        updatedAt: now
      });
      return true;
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      throw new Error(`Erreur lors de la mise à jour: ${errorMessage}`);
    }
  }

  // Récupérer une commande par son ID
  async getOrderById(orderId: string): Promise<OrderDocument | null> {
    try {
      const doc = await adminDb.collection(ORDERS_COLLECTION).doc(orderId).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt || new Date(),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt || new Date()
      } as OrderDocument;
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }
}
