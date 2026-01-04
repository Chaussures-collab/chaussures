/** @format */

import { dbProduits } from "@/components/home/produits/produitsDB";
import { ProductService } from "@/services/dashboard/ProductService";
import ProduitDetailContainer from "@/components/produitDetail/produitDetail.container";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import { ProduitType } from "@/types/produitType";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
import {
  convertProductDocumentToProduitType,
  generateUniqueIdFromFirestoreId
} from "@/utils/productUtils";

type Props = {
  produit: ProduitType | null;
};

export default function DetailProduit({ produit }: Props) {
  if (!produit) {
    return (
      <Layout isDisplayCreadCrumbs={false}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-xl font-semibold text-gray-900 mb-2">Produit introuvable</p>
          <p className="text-gray-600">Le produit que vous recherchez n&apos;existe pas ou a été supprimé.</p>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Seo
        title={`${produit.nom} - SnipersMarket | ${produit.categorie}`}
        description={`Découvrez ${produit.nom} sur ShopiMarket. ${produit.description}. Livraison rapide et offres exclusives !`}
      />
      <Layout isDisplayCreadCrumbs={false}>
        <ProduitDetailContainer produit={produit} />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}

// Fonction pour générer les chemins dynamiques
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    // Récupérer les produits depuis Firestore
    const productService = new ProductService();
    const firestoreProducts = await productService.getAllProducts();
    
    // Créer les paths pour les produits Firestore (utiliser l'ID converti)
    const firestorePaths = firestoreProducts
      .filter((product) => product.id) // Filtrer les produits sans ID
      .map((product) => {
        const convertedId = generateUniqueIdFromFirestoreId(product.id);
        return {
          params: { id: convertedId.toString() }
        };
      });
    
    // Créer les paths pour les produits mockés
    const mockPaths = dbProduits.map((produit) => ({
      params: { id: produit.id.toString() }
    }));
    
    // Combiner les deux
    const paths = [...firestorePaths, ...mockPaths];

    return {
      paths,
      fallback: "blocking" // Génère dynamiquement les pages non encore pré-rendues
    };
  } catch (error) {
    console.error("Erreur lors de la génération des paths:", error);
    // En cas d'erreur, utiliser uniquement les produits mockés
    const paths = dbProduits.map((produit) => ({
      params: { id: produit.id.toString() }
    }));

    return {
      paths,
      fallback: "blocking"
    };
  }
};

// Fonction pour récupérer les données d'un produit spécifique
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.id) {
    return { props: { produit: null } };
  }

  const id = params.id as string;
  const numericId = Number(id);

  try {
    const productService = new ProductService();
    
    // Si l'ID est >= 1000000, c'est probablement un produit Firestore converti
    if (numericId >= 1000000) {
      // Récupérer tous les produits Firestore et chercher celui avec l'ID converti correspondant
      const allFirestoreProducts = await productService.getAllProducts();
      for (const product of allFirestoreProducts) {
        if (product.id) {
          const convertedId = generateUniqueIdFromFirestoreId(product.id);
          if (convertedId === numericId) {
            const produit = convertProductDocumentToProduitType(product, product.id);
            return {
              props: { produit },
              revalidate: 10
            };
          }
        }
      }
    } else {
      // Si l'ID est un nombre normal, chercher dans les produits mockés
      const mockProduct = dbProduits.find((p) => p.id === numericId);
      if (mockProduct) {
        return {
          props: { produit: mockProduct },
          revalidate: 10
        };
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    // En cas d'erreur, essayer de trouver dans les produits mockés
    const mockProduct = dbProduits.find((p) => p.id === numericId);
    if (mockProduct) {
      return {
        props: { produit: mockProduct },
        revalidate: 10
      };
    }
  }

  // Produit non trouvé
  return {
    props: { produit: null },
    revalidate: 10
  };
};
