/** @format */

import { db } from "@/config/firebase-config";
import { FirebaseError } from "firebase/app";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  deleteField
} from "firebase/firestore";
import { ProduitType } from "@/types/produitType";

const PRODUCTS_COLLECTION = "products";

export interface ProductDocument extends Omit<ProduitType, "id"> {
  id: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  // S'assurer que les champs optionnels sont bien gérés
  // promotion?: number | null;
  prixPromo?: number | null;
}

export class ProductService {
  // Créer un produit
  async createProduct(
    productData: Omit<ProductDocument, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const now = Timestamp.now();

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

      const productRef = await addDoc(
        collection(db, PRODUCTS_COLLECTION),
        cleanData
      );
      return productRef.id;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la création: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la création du produit");
    }
  }

  // Lire tous les produits
  async getAllProducts(): Promise<ProductDocument[]> {
    try {
      const productsRef = collection(db, PRODUCTS_COLLECTION);
      const q = query(productsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ProductDocument[];
      console.log("+++++querySnapshot", products);

      return products;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la récupération des produits");
    }
  }

  // Lire un produit par ID
  async getProductById(productId: string): Promise<ProductDocument | null> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        return null;
      }

      return {
        id: productSnap.id,
        ...productSnap.data(),
        createdAt: productSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: productSnap.data().updatedAt?.toDate() || new Date()
      } as ProductDocument;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la récupération du produit");
    }
  }

  // Mettre à jour un produit
  async updateProduct(
    productId: string,
    productData: Partial<ProductDocument>
  ): Promise<void> {
    try {
      // Récupérer le produit actuel pour vérifier le stock précédent
      /* const currentProduct = await this.getProductById(productId);
      const previousStock = currentProduct?.quantiteStock || 0;
      const newStock = productData.quantiteStock || 0; */

      const productRef = doc(db, PRODUCTS_COLLECTION, productId);

      const dataToUpdate: Record<string, unknown> = {
        ...productData,
        updatedAt: Timestamp.now()
      };
      // Supprimer prixPromo s’il est vide
      if (
        productData.prixPromo === undefined ||
        productData.prixPromo === null
      ) {
        dataToUpdate.prixPromo = deleteField();
      }

      await updateDoc(productRef, dataToUpdate);

      // Si le produit passe de 0 stock à un stock > 0, notifier les utilisateurs
      /* if (previousStock === 0 && newStock > 0 && currentProduct) {
        try {
          const { StockNotificationService } = await import("@/services/stock/StockNotificationService");
          const stockNotificationService = new StockNotificationService();
          const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://snipersmarket.com"}/detail-produit/${productId}`;
          
          await stockNotificationService.notifyUsersOnStockRestock(
            productId,
            currentProduct.nom || "Produit",
            productUrl
          );
        } catch (notificationError) {
          // Ne pas faire échouer la mise à jour si la notification échoue
          console.error("Erreur lors de la notification de réapprovisionnement:", notificationError);
        }
      } */
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la mise à jour du produit");
    }
  }

  // Supprimer un produit
  async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(productRef);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la suppression du produit");
    }
  }

  // Décrémenter le stock d'un produit après une commande
  async decrementStock(productId: string, quantity: number): Promise<void> {
    try {
      const product = await this.getProductById(productId);
      if (!product) {
        throw new Error(`Produit avec l'ID ${productId} introuvable`);
      }

      const currentStock = product.quantiteStock || 0;
      const newStock = Math.max(0, currentStock - quantity);

      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(productRef, {
        quantiteStock: newStock,
        updatedAt: Timestamp.now()
      });

      console.log(`Stock mis à jour pour le produit ${productId}: ${currentStock} -> ${newStock}`);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la mise à jour du stock: ${error.message}`);
      }
      throw error instanceof Error ? error : new Error("Erreur inconnue lors de la mise à jour du stock");
    }
  }

  // Décrémenter le stock de plusieurs produits après une commande
  async decrementStocks(items: Array<{ productId: string; quantity: number }>): Promise<void> {
    try {
      const updatePromises = items.map((item) =>
        this.decrementStock(item.productId, item.quantity)
      );
      await Promise.all(updatePromises);
      console.log(`Stock mis à jour pour ${items.length} produit(s)`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du stock de plusieurs produits:", error);
      throw error instanceof Error ? error : new Error("Erreur lors de la mise à jour du stock");
    }
  }
}

