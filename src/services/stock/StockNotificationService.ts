/** @format */

import { db } from "@/config/firebase-config";
import { collection, doc, setDoc, getDocs, query, where, updateDoc, Timestamp } from "firebase/firestore";
import { emailService } from "@/services/email/EmailService";

const STOCK_NOTIFICATIONS_COLLECTION = "stockNotifications";

export interface StockNotification {
  id?: string;
  productId: string;
  productName: string;
  email: string;
  createdAt: Date | Timestamp;
  notified?: boolean;
  notifiedAt?: Date | Timestamp;
}

export class StockNotificationService {
  /**
   * Crée une notification de stock
   */
  async createNotification(data: Omit<StockNotification, "id" | "createdAt" | "notified">): Promise<string> {
    try {
      const notificationRef = doc(collection(db, STOCK_NOTIFICATIONS_COLLECTION));
      
      const notification: StockNotification = {
        ...data,
        id: notificationRef.id,
        createdAt: Timestamp.now(),
        notified: false
      };

      await setDoc(notificationRef, notification);
      return notificationRef.id;
    } catch (error) {
      console.error("Erreur lors de la création de la notification:", error);
      throw error;
    }
  }

  /**
   * Récupère toutes les notifications pour un produit
   */
  async getNotificationsForProduct(productId: string): Promise<StockNotification[]> {
    try {
      const q = query(
        collection(db, STOCK_NOTIFICATIONS_COLLECTION),
        where("productId", "==", productId),
        where("notified", "==", false)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as StockNotification[];
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      return [];
    }
  }

  /**
   * Notifie tous les utilisateurs abonnés quand un produit revient en stock
   */
  async notifyUsersOnStockRestock(productId: string, productName: string, productUrl: string): Promise<void> {
    try {
      const notifications = await this.getNotificationsForProduct(productId);
      
      if (notifications.length === 0) {
        console.log(`Aucune notification à envoyer pour le produit ${productId}`);
        return;
      }

      // Envoyer les emails
      const notificationPromises = notifications.map(async (notification) => {
        try {
          await emailService.sendStockRestockNotification({
            email: notification.email,
            productName,
            productUrl
          });

          // Marquer la notification comme envoyée
          if (notification.id) {
            await updateDoc(doc(db, STOCK_NOTIFICATIONS_COLLECTION, notification.id), {
              notified: true,
              notifiedAt: Timestamp.now()
            });
          }
        } catch (error) {
          console.error(`Erreur lors de l'envoi de la notification à ${notification.email}:`, error);
        }
      });

      await Promise.all(notificationPromises);
      console.log(`${notifications.length} notifications envoyées pour le produit ${productName}`);
    } catch (error) {
      console.error("Erreur lors de la notification des utilisateurs:", error);
      throw error;
    }
  }

  /**
   * Vérifie et notifie les utilisateurs pour tous les produits qui viennent d'être réapprovisionnés
   * Cette fonction doit être appelée après une mise à jour de stock
   */
  async checkAndNotifyRestockedProducts(updatedProducts: Array<{ id: string; name: string; previousStock: number; currentStock: number }>): Promise<void> {
    const restockedProducts = updatedProducts.filter(
      (product) => product.previousStock === 0 && product.currentStock > 0
    );

    for (const product of restockedProducts) {
      const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://snipersmarket.com"}/detail-produit/${product.id}`;
      await this.notifyUsersOnStockRestock(product.id, product.name, productUrl);
    }
  }
}

