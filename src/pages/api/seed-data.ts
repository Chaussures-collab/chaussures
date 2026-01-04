/** @format */

import type { NextApiRequest, NextApiResponse } from "next";
import { ProductDocument } from "@/services/dashboard/ProductService";
import { AdminProductService } from "@/services/dashboard/AdminProductService";
import { AdminCategoryService } from "@/services/dashboard/AdminCategoryService";
import { dbProduits } from "@/components/home/produits/produitsDB";
import { dbCategories } from "@/components/home/categorie/categorieDB";

type ResponseData = {
  success: boolean;
  message: string;
  productsCreated?: number;
  categoriesCreated?: number;
  errors?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Vérifier une clé secrète pour sécuriser l'endpoint (optionnel mais recommandé)
  // En développement, on peut permettre l'accès sans secret si SEED_SECRET n'est pas défini
  const { secret } = req.body;
  const expectedSecret = process.env.SEED_SECRET;
  
  // Si SEED_SECRET est défini, vérifier le secret
  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  // Utiliser les services Admin qui contournent les règles de sécurité
  const productService = new AdminProductService();
  const categoryService = new AdminCategoryService();
  const errors: string[] = [];
  let productsCreated = 0;
  let categoriesCreated = 0;

  try {
    // Seeder les catégories
    console.log("Début du seeding des catégories...");
    for (const category of dbCategories) {
      try {
        // Vérifier si la catégorie existe déjà
        const existingCategories = await categoryService.getAllCategories();
        const exists = existingCategories.some((cat) => cat.nom === category.nom);

        if (!exists) {
          await categoryService.createCategory({
            nom: category.nom,
            src: category.src,
            alt: category.alt,
            description: `Catégorie ${category.nom}`
          });
          categoriesCreated++;
          console.log(`Catégorie créée: ${category.nom}`);
        } else {
          console.log(`Catégorie déjà existante: ${category.nom}`);
        }
      } catch (error) {
        const errorMsg = `Erreur lors de la création de la catégorie ${category.nom}: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    // Seeder les produits
    console.log("Début du seeding des produits...");
    for (const produit of dbProduits) {
      try {
        // Vérifier si le produit existe déjà (par nom)
        const existingProducts = await productService.getAllProducts();
        const exists = existingProducts.some((prod) => prod.nom === produit.nom);

        if (!exists) {
          // Gérer les propriétés optionnelles avec des valeurs par défaut
          const prixPromo = "prixPromo" in produit ? produit.prixPromo : "promotion" in produit ? produit.promotion : null;
          const quantiteStock = "quantiteStock" in produit ? produit.quantiteStock : "quantity" in produit ? produit.quantity : 0;

          // Construire l'objet produit en omettant les champs undefined
          const productData: Record<string, unknown> = {
            nom: produit.nom,
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
            dateAjout: produit.dateAjout || new Date().toISOString()
          };

          // Ajouter prixPromo seulement s'il a une valeur
          if (typeof prixPromo === "number" && prixPromo !== null) {
            productData.prixPromo = prixPromo;
          }

          await productService.createProduct(productData as Omit<ProductDocument, "id" | "createdAt" | "updatedAt">);
          productsCreated++;
          console.log(`Produit créé: ${produit.nom}`);
        } else {
          console.log(`Produit déjà existant: ${produit.nom}`);
        }
      } catch (error) {
        const errorMsg = `Erreur lors de la création du produit ${produit.nom}: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Seeding terminé: ${productsCreated} produits et ${categoriesCreated} catégories créés`,
      productsCreated,
      categoriesCreated,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Erreur générale lors du seeding:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue lors du seeding",
      errors
    });
  }
}

