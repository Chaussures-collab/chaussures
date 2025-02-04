/** @format */

import ShopContain from "@/components/shop/contain/shop.contain";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function Shop() {
  return (
    <>
      <Seo
        title="Boutique - ShopiMarket | Découvrez nos produits tendance"
        description="Parcourez notre boutique en ligne ShopiMarket et trouvez des vêtements, accessoires et bien plus. Offres exclusives et livraison rapide !"
      />

      <Layout isDisplayCreadCrumbs={false}>
        <ShobLink />
        <ShopContain />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
