/** @format */

import { db } from "@/config/firebase-config";
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs, Timestamp } from "firebase/firestore";

const ABANDONED_CARTS_COLLECTION = "abandonedCarts";

export interface AbandonedCartItem {
  id: string | number;
  nom: string;
  alt: string;
  src: string;
  prix: number;
  promotion?: string | number | null;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface AbandonedCart {
  id?: string;
  userId?: string;
  userEmail?: string;
  items: AbandonedCartItem[];
  total: number;
  createdAt: Date | Timestamp;
  lastUpdated: Date | Timestamp;
  reminderSent?: boolean;
  reminderSentAt?: Date | Timestamp;
  reminderCount?: number;
  recovered?: boolean;
  recoveredAt?: Date | Timestamp;
}

export class AbandonedCartService {
  /**
   * Sauvegarde un panier abandonné
   */
  async saveAbandonedCart(cartData: Omit<AbandonedCart, "id" | "createdAt" | "lastUpdated">): Promise<string> {
    try {
      const now = Timestamp.now();
      const cartRef = doc(collection(db, ABANDONED_CARTS_COLLECTION));
      
      const cart: AbandonedCart = {
        ...cartData,
        id: cartRef.id,
        createdAt: now,
        lastUpdated: now,
        reminderSent: false,
        reminderCount: 0
      };

      await setDoc(cartRef, cart);
      return cartRef.id;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier abandonné:", error);
      throw error;
    }
  }

  /**
   * Met à jour un panier abandonné
   */
  async updateAbandonedCart(cartId: string, updates: Partial<AbandonedCart>): Promise<void> {
    try {
      const cartRef = doc(db, ABANDONED_CARTS_COLLECTION, cartId);
      await updateDoc(cartRef, {
        ...updates,
        lastUpdated: Timestamp.now()
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier abandonné:", error);
      throw error;
    }
  }

  /**
   * Récupère un panier abandonné par ID
   */
  async getAbandonedCart(cartId: string): Promise<AbandonedCart | null> {
    try {
      const cartRef = doc(db, ABANDONED_CARTS_COLLECTION, cartId);
      const cartSnap = await getDoc(cartRef);
      
      if (!cartSnap.exists()) {
        return null;
      }

      return {
        id: cartSnap.id,
        ...cartSnap.data(),
        createdAt: cartSnap.data().createdAt?.toDate() || new Date(),
        lastUpdated: cartSnap.data().lastUpdated?.toDate() || new Date()
      } as AbandonedCart;
    } catch (error) {
      console.error("Erreur lors de la récupération du panier abandonné:", error);
      return null;
    }
  }

  /**
   * Récupère les paniers abandonnés d'un utilisateur
   */
  async getUserAbandonedCarts(userId: string): Promise<AbandonedCart[]> {
    try {
      const q = query(
        collection(db, ABANDONED_CARTS_COLLECTION),
        where("userId", "==", userId),
        where("recovered", "!=", true)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
      })) as AbandonedCart[];
    } catch (error) {
      console.error("Erreur lors de la récupération des paniers abandonnés:", error);
      return [];
    }
  }

  /**
   * Récupère les paniers abandonnés à relancer (non relancés depuis plus de X heures)
   */
  async getCartsToRemind(hoursThreshold: number = 24): Promise<AbandonedCart[]> {
    try {
      const thresholdDate = new Date();
      thresholdDate.setHours(thresholdDate.getHours() - hoursThreshold);
      
      const q = query(
        collection(db, ABANDONED_CARTS_COLLECTION),
        where("recovered", "!=", true)
      );
      
      const querySnapshot = await getDocs(q);
      const carts = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          lastUpdated: doc.data().lastUpdated?.toDate() || new Date()
        })) as AbandonedCart[];

      // Filtrer les paniers qui doivent être relancés
      return carts.filter((cart) => {
        // Convertir lastUpdated en Date si c'est un Timestamp
        const lastUpdate = cart.lastUpdated instanceof Date 
          ? cart.lastUpdated 
          : (cart.lastUpdated as Timestamp).toDate();
        const shouldRemind = lastUpdate < thresholdDate;
        
        // Vérifier si une relance a déjà été envoyée récemment
        let notRemindedRecently = true;
        if (cart.reminderSent && cart.reminderSentAt) {
          const reminderDate = cart.reminderSentAt instanceof Date
            ? cart.reminderSentAt
            : (cart.reminderSentAt as Timestamp).toDate();
          notRemindedRecently = reminderDate < thresholdDate;
        }
        
        return shouldRemind && notRemindedRecently;
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des paniers à relancer:", error);
      return [];
    }
  }

  /**
   * Marque un panier comme récupéré
   */
  async markAsRecovered(cartId: string): Promise<void> {
    try {
      await this.updateAbandonedCart(cartId, {
        recovered: true,
        recoveredAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Erreur lors du marquage du panier comme récupéré:", error);
      throw error;
    }
  }

  /**
   * Marque un panier comme ayant reçu une relance
   */
  async markReminderSent(cartId: string): Promise<void> {
    try {
      const cart = await this.getAbandonedCart(cartId);
      if (cart) {
        await this.updateAbandonedCart(cartId, {
          reminderSent: true,
          reminderSentAt: Timestamp.now(),
          reminderCount: (cart.reminderCount || 0) + 1
        });
      }
    } catch (error) {
      console.error("Erreur lors du marquage de la relance:", error);
      throw error;
    }
  }

  /**
   * Marque tous les paniers abandonnés d'un utilisateur comme récupérés après un paiement réussi
   */
  async markUserCartsAsRecovered(userId: string): Promise<void> {
    try {
      const carts = await this.getUserAbandonedCarts(userId);
      const updatePromises = carts
        .filter((cart) => !cart.recovered)
        .map((cart) => this.markAsRecovered(cart.id!));
      
      await Promise.all(updatePromises);
      console.log(`Panier(s) abandonné(s) marqué(s) comme récupéré(s) pour l'utilisateur ${userId}`);
    } catch (error) {
      console.error("Erreur lors du marquage des paniers comme récupérés:", error);
      throw error;
    }
  }
}

