/** @format */

/**
 * Service de gestion des commandes avec Firestore
 * Respect du principe : Single Responsibility Principle (SRP)
 * Responsabilité unique : gérer les commandes dans Firestore
 */

import { IOrderService } from "../interfaces/IOrderService";
import { OrderData, PaymentStatus } from "@/types/payment.types";
import { db } from "@/config/firebase-config";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  Timestamp
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { OrderError, NotFoundError } from "../errors/PaymentError";
import { ErrorHandler } from "../errors/ErrorHandler";

const ORDERS_COLLECTION = "orders";

export class OrderService implements IOrderService {
  async createOrder(
    orderData: Omit<OrderData, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const orderId = uuidv4();
      const now = new Date();

      const order: OrderData = {
        ...orderData,
        id: orderId,
        createdAt: now,
        updatedAt: now
      };

      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await setDoc(orderRef, {
        ...order,
        createdAt: Timestamp.fromDate(order.createdAt),
        updatedAt: Timestamp.fromDate(order.updatedAt)
      });
      console.log("Commande créée avec l'ID :", orderId);

      return orderId;
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "createOrder", orderData }
      );

      if (error instanceof OrderError) {
        throw error;
      }

      throw ErrorHandler.createOrderError(
        `Impossible de créer la commande: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        undefined,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: PaymentStatus
  ): Promise<boolean> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: Timestamp.fromDate(new Date())
      });

      return true;
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "updateOrderStatus", orderId, status }
      );

      if (error instanceof OrderError) {
        throw error;
      }

      throw ErrorHandler.createOrderError(
        `Impossible de mettre à jour la commande: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        orderId,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async getOrderById(orderId: string): Promise<OrderData | null> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        return null;
      }

      const data = orderSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      } as OrderData;
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "getOrderById", orderId }
      );

      if (error instanceof OrderError || error instanceof NotFoundError) {
        throw error;
      }

      throw ErrorHandler.createOrderError(
        `Impossible de récupérer la commande: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        orderId,
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async getOrdersByUserId(userId: string): Promise<OrderData[]> {
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const q = query(ordersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as OrderData;
      });
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "getOrdersByUserId", userId }
      );

      if (error instanceof OrderError) {
        throw error;
      }

      throw ErrorHandler.createOrderError(
        `Impossible de récupérer les commandes: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        undefined,
        { userId, originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  async updateOrderWithStripeSession(
    orderId: string,
    stripeSessionId: string
  ): Promise<boolean> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, {
        stripeSessionId,
        updatedAt: Timestamp.fromDate(new Date())
      });

      return true;
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "updateOrderWithStripeSession", orderId, stripeSessionId }
      );

      if (error instanceof OrderError) {
        throw error;
      }

      throw ErrorHandler.createOrderError(
        `Impossible de mettre à jour la commande avec la session Stripe: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        orderId,
        { stripeSessionId, originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }
}

