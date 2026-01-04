/** @format */

import { adminDb } from "@/config/firebase-admin";
import { ProductDocument } from "./ProductService";
import * as admin from "firebase-admin";

const PRODUCTS_COLLECTION = "products";

export class AdminProductService {
  // Créer un produit avec Admin SDK (contourne les règles de sécurité)
  async createProduct(productData: Omit<ProductDocument, "id" | "createdAt" | "updatedAt">): Promise<string> {
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
      
      const productRef = await adminDb.collection(PRODUCTS_COLLECTION).add(cleanData);
      return productRef.id;
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      throw new Error(`Erreur lors de la création: ${errorMessage}`);
    }
  }

  // Récupérer tous les produits
  async getAllProducts(): Promise<ProductDocument[]> {
    try {
      // Ne pas utiliser orderBy si le champ n'existe pas encore dans la collection
      const snapshot = await adminDb.collection(PRODUCTS_COLLECTION).get();
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt || new Date()
        } as ProductDocument;
      });
    } catch (error) {
      const errorMessage = error && typeof error === "object" && "message" in error ? String(error.message) : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }
}

