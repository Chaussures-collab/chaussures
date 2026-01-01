/** @format */

import FunForFurnitureGrid from "@/components/autre";
import Categorie from "@/components/home/categorie/categorie";
import MarqueContainer from "@/components/home/marque/marque.container";
import Produits from "@/components/home/produits/produits";
import Decouvrir from "@/components/home/shop";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import FeaturesSection from "@/components/home/features/FeaturesSection";
import NewsletterSection from "@/components/home/newsletter/NewsletterSection";
import TestimonialsSection from "@/components/home/testimonials/TestimonialsSection";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function index() {
  return (
    <>
      <Seo
        title="SnipersMarket- Votre plateforme e-commerce pour tous vos besoins"
        description="Découvrez une large gamme de produits de qualité sur ShopiMarket. Livraison rapide, paiement sécurisé et promotions exclusives !"
      />
      <Layout isDisplayCreadCrumbs={false}>
        {/* Hero Section */}
        <Decouvrir />

        {/* Marques */}
        <MarqueContainer />

        {/* Catégories */}
        <Categorie />

        {/* Produits populaires */}
        <Produits />

        {/* Features */}
        <FeaturesSection />

        {/* Témoignages */}
        <TestimonialsSection />

        {/* Newsletter */}
        <NewsletterSection />

        {/* Autres sections */}
        <FunForFurnitureGrid />

        {/* Qualité et services */}
        <QualiteContainer />

        {/* Paiement */}
        <Paiement />
      </Layout>
    </>
  );
}
