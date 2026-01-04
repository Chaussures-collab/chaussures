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
  Timestamp
} from "firebase/firestore";
import { ProduitType } from "@/types/produitType";

const PRODUCTS_COLLECTION = "products";

export interface ProductDocument extends Omit<ProduitType, "id"> {
  id?: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
  // S'assurer que les champs optionnels sont bien gérés
  // promotion?: number | null;
  prixPromo?: number | null;
}

export class ProductService {
  // Créer un produit
  async createProduct(productData: Omit<ProductDocument, "id" | "createdAt" | "updatedAt">): Promise<string> {
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
      
      const productRef = await addDoc(collection(db, PRODUCTS_COLLECTION), cleanData);
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
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ProductDocument[];
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
  async updateProduct(productId: string, productData: Partial<ProductDocument>): Promise<void> {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await updateDoc(productRef, {
        ...productData,
        updatedAt: Timestamp.now()
      });
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
}

