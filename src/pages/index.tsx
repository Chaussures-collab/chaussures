/** @format */

import FunForFurnitureGrid from "@/components/autre";
import Categorie from "@/components/home/categorie/categorie";
import MarqueContainer from "@/components/home/marque/marque.container";
import Produits from "@/components/home/produits/produits";
import Decouvrir from "@/components/home/shop";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function index() {
  return (
    <>
      <Seo
        title="ShopiMarket - Votre boutique en ligne pour vêtements et accessoires"
        description="Découvrez une large gamme de vêtements et d’accessoires tendance sur ShopiMarket. Livraison rapide et promotions exclusives !"
      />
      <Layout isDisplayCreadCrumbs={false}>
        <Decouvrir />
        <MarqueContainer />
        <Categorie />
        <Produits />
        <FunForFurnitureGrid />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
