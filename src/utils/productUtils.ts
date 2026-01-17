/** @format */

import { ProductDocument } from "@/services/dashboard/ProductService";
import { ProduitType } from "@/types/produitType";
// import { dbProduits } from "@/components/home/produits/produitsDB";
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
export const convertProductDocumentToProduitType = (
  doc: ProductDocument,
  firestoreId?: string
): ProduitType => {
  return {
    id: firestoreId ?? doc.id, // 🔥 ID FIRESTORE DIRECT
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
    images: (doc.images || []).map((img) => ({
      ...img,
      src: normalizeImagePath(img.src)
    })),
    colors: doc.colors || [],
    sizes: doc.sizes || []
  };
};


// Fonction pour trouver un produit par ID (cherche dans Firestore et mock)
export const findProductById = async (
  productId: string,
  productService: {
    getProductById: (id: string) => Promise<ProductDocument | null>;
  }
): Promise<ProduitType | null> => {
  try {
    const product = await productService.getProductById(productId);
    return product
      ? convertProductDocumentToProduitType(product, productId)
      : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return null;
  }
};


