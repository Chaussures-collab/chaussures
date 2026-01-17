/** @format */

import { useState, useEffect } from "react";
import { ProductService } from "@/services/dashboard/ProductService";
import { ProduitType } from "@/types/produitType";
// import { dbProduits } from "@/components/home/produits/produitsDB";
import { convertProductDocumentToProduitType } from "@/utils/productUtils";

export function useProducts() {
  const [products, setProducts] = useState<ProduitType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer les produits depuis Firestore
        const productService = new ProductService();
        const firestoreProducts = await productService.getAllProducts();
        
        // Convertir les produits Firestore en ProduitType
        const convertedProducts = firestoreProducts.map((product) =>
          convertProductDocumentToProduitType(product, product.id)
        );

        // Combiner les produits Firestore avec les produits mockés
        // Les produits Firestore ont la priorité (ils sont ajoutés en premier)
        // const allProducts = [...convertedProducts];

        setProducts(convertedProducts);
      } catch (err) {
        console.error("Erreur lors du chargement des produits:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        // En cas d'erreur, utiliser uniquement les produits mockés
        // setProducts(dbProduits);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, isLoading, error };
}

