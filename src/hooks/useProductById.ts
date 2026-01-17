/** @format */

import { useState, useEffect } from "react";
import { ProductService } from "@/services/dashboard/ProductService";
import { ProduitType } from "@/types/produitType";
import { convertProductDocumentToProduitType } from "@/utils/productUtils";

export function useProductById(productId?: string) {
  const [product, setProduct] = useState<ProduitType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const productService = new ProductService();
        const firestoreProduct = await productService.getProductById(productId);

        if (!firestoreProduct) {
          setProduct(null);
          setError("Produit introuvable");
          return;
        }

        setProduct(
          convertProductDocumentToProduitType(firestoreProduct, productId)
        );
      } catch (err) {
        console.error("Erreur lors du chargement du produit:", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  return { product, isLoading, error };
}
