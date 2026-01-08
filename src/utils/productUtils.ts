/** @format */

import { ProductDocument } from "@/services/dashboard/ProductService";
import { ProduitType } from "@/types/produitType";
import { dbProduits } from "@/components/home/produits/produitsDB";
import { normalizeImagePath } from "./imageUtils";

// Fonction pour générer un ID unique à partir d'un ID Firestore
export const generateUniqueIdFromFirestoreId = (firestoreId: string | undefined): number => {
  if (!firestoreId) return Date.now();
  // Convertir l'ID Firestore en nombre (hash simple)
  let hash = 0;
  for (let i = 0; i < firestoreId.length; i++) {
    const char = firestoreId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // S'assurer que l'ID est positif et unique (ajouter un offset pour éviter les collisions avec les IDs mockés)
  return Math.abs(hash) + 1000000 || Date.now();
};

// Fonction pour convertir ProductDocument en ProduitType
export const convertProductDocumentToProduitType = (doc: ProductDocument, firestoreId?: string): ProduitType => {
  const uniqueId = firestoreId ? generateUniqueIdFromFirestoreId(firestoreId) : generateUniqueIdFromFirestoreId(doc.id);
  
  return {
    id: uniqueId,
    src: normalizeImagePath(doc.src),
    alt: doc.alt || "",
    prix: doc.prix || 0,
    nom: doc.nom || "",
    categorie: doc.categorie || "",
    dateAjout: doc.dateAjout || new Date().toISOString(),
    description: doc.description || "",
    description1: doc.description1 || "",
    quantiteStock: doc.quantiteStock,
    prixPromo: doc.prixPromo ?? null,
    promotion: doc.prixPromo ?? null,
    images: (doc.images || []).map(img => ({
      ...img,
      src: normalizeImagePath(img.src)
    })),
    colors: doc.colors || [],
    sizes: doc.sizes || []
  };
};

// Fonction pour trouver un produit par ID (cherche dans Firestore et mock)
export const findProductById = async (
  id: string | number,
  productService?: { getAllProducts: () => Promise<ProductDocument[]>; getProductById: (id: string) => Promise<ProductDocument | null> }
): Promise<ProduitType | null> => {
  const idString = String(id);
  const idNumber = Number(id);

  // Si l'ID est un nombre >= 1000000, c'est probablement un produit Firestore converti
  if (idNumber >= 1000000 && productService) {
    try {
      // Essayer de trouver dans tous les produits Firestore
      const allFirestoreProducts = await productService.getAllProducts();
      for (const product of allFirestoreProducts) {
        const convertedId = generateUniqueIdFromFirestoreId(product.id);
        if (convertedId === idNumber) {
          return convertProductDocumentToProduitType(product, product.id);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la recherche dans Firestore:", error);
    }
  }

  // Si l'ID est un string et qu'on a un productService, essayer de chercher directement par ID Firestore
  if (typeof id === "string" && productService) {
    try {
      const firestoreProduct = await productService.getProductById(idString);
      if (firestoreProduct) {
        return convertProductDocumentToProduitType(firestoreProduct, idString);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération depuis Firestore:", error);
    }
  }

  // Chercher dans les produits mockés
  const mockProduct = dbProduits.find((p) => p.id === idNumber);
  if (mockProduct) {
    return mockProduct;
  }

  return null;
};

