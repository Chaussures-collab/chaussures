/** @format */

import { useState, useEffect } from "react";
import { CategoryService, CategoryDocument } from "@/services/dashboard/CategoryService";
// import { dbCategories } from "@/components/home/categorie/categorieDB";

export interface Category {
  src: string;
  alt: string;
  nom: string;
  description?: string;
}

// Fonction pour convertir CategoryDocument en Category
const convertCategoryDocumentToCategory = (doc: CategoryDocument): Category => {
  return {
    src: doc.src || "",
    alt: doc.alt || "",
    nom: doc.nom || "",
    description: doc.description
  };
};

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer les catégories depuis Firestore
        const categoryService = new CategoryService();
        const firestoreCategories = await categoryService.getAllCategories();
        
        // Convertir les catégories Firestore en Category
        const convertedCategories = firestoreCategories.map(convertCategoryDocumentToCategory);
        
        // Combiner les catégories Firestore avec les catégories mockées
        // Les catégories Firestore ont la priorité (elles sont ajoutées en premier)
        const allCategories = [...convertedCategories];
        
        setCategories(allCategories);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        // En cas d'erreur, utiliser uniquement les catégories mockées
        // setCategories(dbCategories);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, isLoading, error };
}

