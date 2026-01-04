/** @format */

import NewsletterSection from "@/components/home/newsletter/NewsletterSection";
import ShopContain from "@/components/shop/contain/shop.contain";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function Shop() {
  return (
    <>
      <Seo
        title="Boutique - SnipersMarket| Découvrez nos produits tendance"
        description="Parcourez notre boutique en ligne SnipersMarketet trouvez des vêtements, accessoires et bien plus. Offres exclusives et livraison rapide !"
      />

      <Layout isDisplayCreadCrumbs={false}>
        {/* <ShobLink /> */}
        <ShopContain />
        {/* Newsletter */}
        <NewsletterSection />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
