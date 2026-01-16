/** @format */

import { getAdminDb } from "@/config/firebase-admin";
import { ProductDocument } from "./ProductService";
import * as admin from "firebase-admin";

const PRODUCTS_COLLECTION = "products";

export class AdminProductService {
  // Créer un produit avec Admin SDK (contourne les règles de sécurité)
  async createProduct(
    productData: Omit<ProductDocument, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const now = admin.firestore.Timestamp.now();

      // Nettoyer les données : supprimer les champs undefined
      const cleanData: Record<string, unknown> = {
        createdAt: now,
        updatedAt: now
      };

      // Copier seulement les champs définis (pas undefined)
      Object.keys(productData).forEach((key) => {
        const value = (productData as Record<string, unknown>)[key];
        if (value !== undefined) {
          cleanData[key] = value;
        }
      });

      const db = getAdminDb();
      const productRef = await db
        .collection(PRODUCTS_COLLECTION)
        .add(cleanData);
      return productRef.id;
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la création: ${errorMessage}`);
    }
  }

  // Récupérer tous les produits
  async getAllProducts(): Promise<ProductDocument[]> {
    try {
      const db = getAdminDb();
      // Ne pas utiliser orderBy si le champ n'existe pas encore dans la collection
      const snapshot = await db.collection(PRODUCTS_COLLECTION).get();
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
        } as ProductDocument;
      });
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }

  // Récupérer un produit par ID
  async getProductById(productId: string): Promise<ProductDocument | null> {
    try {
      const db = getAdminDb();
      const doc = await db.collection(PRODUCTS_COLLECTION).doc(productId).get();
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
      } as ProductDocument;
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }

  // Décrémenter le stock d'un produit après une commande (avec Admin SDK)
  async decrementStock(productId: string, quantity: number): Promise<void> {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error(`Produit avec l'ID ${productId} introuvable`);
      }

      const currentStock = product.quantiteStock || 0;
      const newStock = Math.max(0, currentStock - quantity);

      const db = getAdminDb();
      await db.collection(PRODUCTS_COLLECTION).doc(productId).update({
        quantiteStock: newStock,
        updatedAt: admin.firestore.Timestamp.now()
      });

      console.log(
        `✅ [AdminProductService] Stock mis à jour pour le produit ${productId}: ${currentStock} -> ${newStock}`
      );
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      console.error(
        `❌ [AdminProductService] Erreur lors de la mise à jour du stock: ${errorMessage}`
      );
      throw new Error(
        `Erreur lors de la mise à jour du stock: ${errorMessage}`
      );
    }
  }

  // Décrémenter le stock de plusieurs produits après une commande (avec Admin SDK)
  async decrementStocks(
    items: Array<{ productId: string; quantity: number }>
  ): Promise<void> {
    try {
      const updatePromises = items.map((item) =>
        this.decrementStock(item.productId, item.quantity)
      );
      await Promise.all(updatePromises);
      console.log(
        `✅ [AdminProductService] Stock mis à jour pour ${items.length} produit(s)`
      );
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      console.error(
        `❌ [AdminProductService] Erreur lors de la mise à jour du stock de plusieurs produits: ${errorMessage}`
      );
      throw new Error(
        `Erreur lors de la mise à jour du stock: ${errorMessage}`
      );
    }
  }
}

