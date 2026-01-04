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

export interface CategoryDocument {
  id?: string;
  nom: string;
  src: string;
  alt: string;
  description?: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

const CATEGORIES_COLLECTION = "categories";

export class CategoryService {
  // Créer une catégorie
  async createCategory(categoryData: Omit<CategoryDocument, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const now = Timestamp.now();
      
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
      
      const categoryRef = await addDoc(collection(db, CATEGORIES_COLLECTION), cleanData);
      return categoryRef.id;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la création: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la création de la catégorie");
    }
  }

  // Lire toutes les catégories
  async getAllCategories(): Promise<CategoryDocument[]> {
    try {
      const categoriesRef = collection(db, CATEGORIES_COLLECTION);
      const q = query(categoriesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as CategoryDocument[];
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la récupération des catégories");
    }
  }

  // Lire une catégorie par ID
  async getCategoryById(categoryId: string): Promise<CategoryDocument | null> {
    try {
      const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
      const categorySnap = await getDoc(categoryRef);
      
      if (!categorySnap.exists()) {
        return null;
      }
      
      return {
        id: categorySnap.id,
        ...categorySnap.data(),
        createdAt: categorySnap.data().createdAt?.toDate() || new Date(),
        updatedAt: categorySnap.data().updatedAt?.toDate() || new Date()
      } as CategoryDocument;
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la récupération de la catégorie");
    }
  }

  // Mettre à jour une catégorie
  async updateCategory(categoryId: string, categoryData: Partial<CategoryDocument>): Promise<void> {
    try {
      const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
      await updateDoc(categoryRef, {
        ...categoryData,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la mise à jour: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la mise à jour de la catégorie");
    }
  }

  // Supprimer une catégorie
  async deleteCategory(categoryId: string): Promise<void> {
    try {
      const categoryRef = doc(db, CATEGORIES_COLLECTION, categoryId);
      await deleteDoc(categoryRef);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(`Erreur lors de la suppression: ${error.message}`);
      }
      throw new Error("Erreur inconnue lors de la suppression de la catégorie");
    }
  }
}

