/** @format */

import {
  adminTimestamp,
  // isInitialized,
  getAdminDb
} from "@/config/firebase-admin";
import { OrderData, PaymentStatus } from "@/types/payment.types";
import * as admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

const ORDERS_COLLECTION = "orders";

export interface OrderDocument
  extends Omit<OrderData, "createdAt" | "updatedAt"> {
  id: string;
  createdAt: Date | admin.firestore.Timestamp;
  updatedAt: Date | admin.firestore.Timestamp;
}

export class AdminOrderService {
  // Créer une commande avec Admin SDK (contourne les règles de sécurité)
  async createOrder(
    orderData: Omit<OrderData, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      console.log(`🔵 [AdminOrderService] Début de création de commande...`);
      console.log(`🔵 [AdminOrderService] OrderData reçu:`, {
        userId: orderData.userId,
        userEmail: orderData.userEmail,
        itemsCount: orderData.items?.length || 0,
        totalAmount: orderData.totalAmount,
        status: orderData.status
      });

      // Vérifier que adminDb est initialisé
      const db = getAdminDb();

      const orderId = uuidv4();
      const now = adminTimestamp ? adminTimestamp.now() : new Date();

      // Fonction utilitaire pour nettoyer les valeurs undefined
      const cleanObject = (
        obj: Record<string, unknown>
      ): Record<string, unknown> => {
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              // Nettoyer aussi les éléments des tableaux
              cleaned[key] = value.map((item) => {
                if (typeof item === "object" && item !== null) {
                  return cleanObject(item as Record<string, unknown>);
                }
                return item;
              });
            } else if (
              typeof value === "object" &&
              value !== null &&
              !(value instanceof Date) &&
              value.constructor === Object
            ) {
              // Récursif pour les objets imbriqués
              cleaned[key] = cleanObject(value as Record<string, unknown>);
            } else {
              cleaned[key] = value;
            }
          }
        }
        return cleaned;
      };

      // Créer l'objet commande avec les bons types
      const orderDataToSave: Record<string, unknown> = {
        id: orderId,
        userId: orderData.userId,
        userEmail: orderData.userEmail,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        currency: orderData.currency,
        status: orderData.status,
        paymentMethod: orderData.paymentMethod,
        stripeSessionId: orderData.stripeSessionId,
        metadata: orderData.metadata || {},
        createdAt: now,
        updatedAt: now
      };

      // Ajouter paymentIntentId si présent
      if (orderData.paymentIntentId) {
        orderDataToSave.paymentIntentId = orderData.paymentIntentId;
      }

      // Nettoyer les valeurs undefined avant d'envoyer à Firestore
      const cleanedOrderData = cleanObject(orderDataToSave);

      console.log(
        `🔵 [AdminOrderService] Tentative d'écriture dans Firestore...`
      );
      await db.collection(ORDERS_COLLECTION).doc(orderId).set(cleanedOrderData);
      console.log(
        `✅ [AdminOrderService] Commande créée avec l'ID : ${orderId}`
      );

      return orderId;
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      const errorDetails =
        error && typeof error === "object" && "code" in error
          ? String(error.code)
          : "Pas de code d'erreur";
      console.error(
        `❌ [AdminOrderService] Erreur lors de la création de la commande: ${errorMessage}`
      );
      console.error(`❌ [AdminOrderService] Code d'erreur: ${errorDetails}`);
      console.error(
        `❌ [AdminOrderService] Stack trace:`,
        error instanceof Error ? error.stack : "Pas de stack trace"
      );
      throw new Error(
        `Impossible de créer la commande: ${errorMessage} (Code: ${errorDetails})`
      );
    }
  }
  // Récupérer toutes les commandes
  async getAllOrders(): Promise<OrderDocument[]> {
    try {
      const db = getAdminDb();
      const snapshot = await db
        .collection(ORDERS_COLLECTION)
        .orderBy("createdAt", "desc")
        .get();
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : data.updatedAt || new Date()
        } as OrderDocument;
      });
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }

  // Mettre à jour le statut d'une commande
  async updateOrderStatus(
    orderId: string,
    status: PaymentStatus
  ): Promise<boolean> {
    try {
      const db = getAdminDb();
      const now = admin.firestore.Timestamp.now();
      await db.collection(ORDERS_COLLECTION).doc(orderId).update({
        status,
        updatedAt: now
      });
      return true;
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la mise à jour: ${errorMessage}`);
    }
  }

  // Récupérer une commande par son ID
  async getOrderById(orderId: string): Promise<OrderDocument | null> {
    try {
      const db = getAdminDb();
      const doc = await db.collection(ORDERS_COLLECTION).doc(orderId).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate
          ? data.createdAt.toDate()
          : data?.createdAt || new Date(),
        updatedAt: data?.updatedAt?.toDate
          ? data.updatedAt.toDate()
          : data?.updatedAt || new Date()
      } as OrderDocument;
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }
}
