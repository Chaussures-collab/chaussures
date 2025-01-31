/** @format */

import { dbProduits } from "@/components/home/produits/produitsDB";
import ProduitDetailContainer from "@/components/produitDetail/produitDetail.container";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import { ProduitType } from "@/types/produitType";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";
type Props = {
  produit: ProduitType | null;
};

export default function DetailProduit({ produit }: Props) {
  if (!produit) {
    return <p>Produit introuvable.</p>;
  }

  return (
    <>
      <Seo title="Markets" description="Detail du produit" />
      <Layout isDisplayCreadCrumbs={false}>
        <ProduitDetailContainer produit={produit} />
        <QualiteContainer />
      </Layout>
    </>
  );
}

// Fonction pour générer les chemins dynamiques
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = dbProduits.map((produit) => ({
    params: { id: produit.id.toString() }, // Assurez-vous que produit.id existe et est un nombre
  }));

  return {
    paths,
    fallback: "blocking", // Génère dynamiquement les pages non encore pré-rendues
  };
};


// Fonction pour récupérer les données d'un produit spécifique
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params?.id) {
    return { props: { produit: null } }; // Si aucun id n'est trouvé, retournez null
  }

  const id = Number(params.id); // Assurez-vous que `id` est un nombre

  // Recherche du produit correspondant
  const produit = dbProduits.find((p) => p.id === id) || null;

  return {
    props: {
      produit,
    },
    revalidate: 10,
  };
};


