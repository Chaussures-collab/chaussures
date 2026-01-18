/** @format */

import { getAdminDb } from "@/config/firebase-admin";
import * as admin from "firebase-admin";
import { AbandonedCart } from "./AbandonedCartService";

const ABANDONED_CARTS_COLLECTION = "abandonedCarts";

export class AdminAbandonedCartService {
  /**
   * Récupère les paniers abandonnés d'un utilisateur (non récupérés)
   */
  async getUserAbandonedCarts(userId: string): Promise<AbandonedCart[]> {
    try {
      const db = getAdminDb();
      const snapshot = await db
        .collection(ABANDONED_CARTS_COLLECTION)
        .where("userId", "==", userId)
        .where("recovered", "!=", true)
        .get();
      
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
          lastUpdated: data.lastUpdated?.toDate ? data.lastUpdated.toDate() : data.lastUpdated || new Date()
        } as AbandonedCart;
      });
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      console.error(`❌ [AdminAbandonedCartService] Erreur lors de la récupération des paniers: ${errorMessage}`);
      return [];
    }
  }

  /**
   * Marque un panier comme récupéré
   */
  async markAsRecovered(cartId: string): Promise<void> {
    try {
      const db = getAdminDb();
      await db.collection(ABANDONED_CARTS_COLLECTION).doc(cartId).update({
        recovered: true,
        recoveredAt: admin.firestore.Timestamp.now()
      });
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      console.error(`❌ [AdminAbandonedCartService] Erreur lors du marquage du panier: ${errorMessage}`);
      throw new Error(`Erreur lors du marquage du panier: ${errorMessage}`);
    }
  }

  /**
   * Marque tous les paniers abandonnés d'un utilisateur comme récupérés après un paiement réussi
   */
  async markUserCartsAsRecovered(userId: string): Promise<void> {
    try {
      const carts = await this.getUserAbandonedCarts(userId);
      const updatePromises = carts
        .filter((cart) => !cart.recovered && cart.id)
        .map((cart) => this.markAsRecovered(cart.id!));
      
      await Promise.all(updatePromises);
      console.log(`✅ [AdminAbandonedCartService] Panier(s) abandonné(s) marqué(s) comme récupéré(s) pour l'utilisateur ${userId} (${carts.length} panier(s))`);
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      console.error(`❌ [AdminAbandonedCartService] Erreur lors du marquage des paniers comme récupérés: ${errorMessage}`);
      throw new Error(`Erreur lors du marquage des paniers: ${errorMessage}`);
    }
  }

  /**
   * Supprime tous les paniers abandonnés d'un utilisateur après paiement réussi
   */
  async clearUserCarts(userId: string): Promise<void> {
    try {
      const db = getAdminDb();
      const snapshot = await db
        .collection(ABANDONED_CARTS_COLLECTION)
        .where("userId", "==", userId)
        .get();
      
      const deletePromises = snapshot.docs.map((doc) =>
        db.collection(ABANDONED_CARTS_COLLECTION).doc(doc.id).delete()
      );
      
      await Promise.all(deletePromises);
      console.log(`✅ [AdminAbandonedCartService] Panier(s) supprimé(s) pour l'utilisateur ${userId} (${snapshot.docs.length} panier(s))`);
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      console.error(`❌ [AdminAbandonedCartService] Erreur lors de la suppression des paniers: ${errorMessage}`);
      throw new Error(`Erreur lors de la suppression des paniers: ${errorMessage}`);
    }
  }
}



