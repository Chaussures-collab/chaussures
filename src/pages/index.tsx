/** @format */

import FunForFurnitureGrid from "@/components/autre";
import Categorie from "@/components/home/categorie/categorie";
import MarqueContainer from "@/components/home/marque/marque.container";
import Produits from "@/components/home/produits/produits";
import Decouvrir from "@/components/home/shop";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function index() {
  return (
    <>
      <Seo title="Markets" description="E-commerce" />
      <Layout isDisplayCreadCrumbs={false}>
        <Decouvrir />
        <MarqueContainer/>
        <Categorie/>
        <Produits/>
        <FunForFurnitureGrid/>
        <QualiteContainer/>
      </Layout>
    </>
  );
}
