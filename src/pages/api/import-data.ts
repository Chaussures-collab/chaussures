/** @format */

import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/config/firebase-admin";
import { dbProduits } from "@/components/home/produits/produitsDB";
import { dbCategories } from "@/components/home/categorie/categorieDB";
import * as admin from "firebase-admin";

type ResponseData = {
  success: boolean;
  message: string;
  productsCreated?: number;
  categoriesCreated?: number;
  errors?: string[];
};

function getErrorMessage(error: unknown): string {
  try {
    if (error && typeof error === "object") {
      if ("message" in error) {
        return String(error.message);
      }
      if ("toString" in error && typeof error.toString === "function") {
        return error.toString();
      }
      return JSON.stringify(error);
    }
    if (typeof error === "string") {
      return error;
    }
    return "Erreur inconnue";
  } catch {
    return "Erreur lors de la gestion de l'erreur";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const errors: string[] = [];
  let productsCreated = 0;
  let categoriesCreated = 0;

  try {
    const now = admin.firestore.Timestamp.now();

    // Importer les catégories
    console.log("Début de l'importation des catégories...");
    for (const category of dbCategories) {
      try {

        const cleanData: Record<string, unknown> = {
          nom: category.nom,
          src: category.src || "",
          alt: category.alt || "",
          description: `Catégorie ${category.nom}`,
          createdAt: now,
          updatedAt: now
        };

        await adminDb.collection("categories").add(cleanData);
        categoriesCreated++;
        console.log(`✅ Catégorie créée: ${category.nom}`);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        const errorMsg = `❌ Erreur catégorie ${category.nom}: ${errorMessage}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    // Importer les produits
    console.log("Début de l'importation des produits...");
    for (const produit of dbProduits) {
      try {

        // Gérer les propriétés optionnelles
        const prixPromo = "prixPromo" in produit ? produit.prixPromo : "promotion" in produit ? produit.promotion : null;
        const quantiteStock = "quantiteStock" in produit ? produit.quantiteStock : "quantity" in produit ? produit.quantity : 0;

        // Construire l'objet produit
        const cleanData: Record<string, unknown> = {
          nom: produit.nom || "",
          description: produit.description || "",
          description1: produit.description1 || "",
          prix: produit.prix || 0,
          quantiteStock: typeof quantiteStock === "number" ? quantiteStock : 0,
          categorie: produit.categorie || "",
          src: produit.src || "",
          alt: produit.alt || produit.nom || "",
          images: produit.images || [],
          colors: produit.colors || [],
          sizes: produit.sizes || [],
          dateAjout: produit.dateAjout || new Date().toISOString(),
          createdAt: now,
          updatedAt: now
        };

        // Ajouter prixPromo seulement s'il a une valeur
        if (typeof prixPromo === "number" && prixPromo !== null) {
          cleanData.prixPromo = prixPromo;
        }

        await adminDb.collection("products").add(cleanData);
        productsCreated++;
        console.log(`✅ Produit créé: ${produit.nom}`);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        const errorMsg = `❌ Erreur produit ${produit.nom}: ${errorMessage}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Importation terminée: ${productsCreated} produits et ${categoriesCreated} catégories créés`,
      productsCreated,
      categoriesCreated,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("❌ Erreur générale lors de l'importation:", error);
    return res.status(500).json({
      success: false,
      message: getErrorMessage(error),
      errors
    });
  }
}
