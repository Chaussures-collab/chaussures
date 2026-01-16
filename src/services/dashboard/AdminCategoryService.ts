/** @format */

import { getAdminDb } from "@/config/firebase-admin";
import { CategoryDocument } from "./CategoryService";
import * as admin from "firebase-admin";

const CATEGORIES_COLLECTION = "categories";

export class AdminCategoryService {
  // Créer une catégorie avec Admin SDK (contourne les règles de sécurité)
  async createCategory(
    categoryData: Omit<CategoryDocument, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    try {
      const now = admin.firestore.Timestamp.now();

      // Nettoyer les données : supprimer les champs undefined
      const cleanData: Record<string, unknown> = {
        createdAt: now,
        updatedAt: now
      };

      // Copier seulement les champs définis (pas undefined)
      Object.keys(categoryData).forEach((key) => {
        const value = (categoryData as Record<string, unknown>)[key];
        if (value !== undefined) {
          cleanData[key] = value;
        }
      });

      const db = getAdminDb();
      const categoryRef = await db
        .collection(CATEGORIES_COLLECTION)
        .add(cleanData);
      return categoryRef.id;
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la création: ${errorMessage}`);
    }
  }

  // Récupérer toutes les catégories
  async getAllCategories(): Promise<CategoryDocument[]> {
    try {
      const db = getAdminDb();
      const snapshot = await db.collection(CATEGORIES_COLLECTION).get();
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
        } as CategoryDocument;
      });
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";
      throw new Error(`Erreur lors de la récupération: ${errorMessage}`);
    }
  }
}

