/** @format */

import CartTable from "@/components/cart/cartTable";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function cart() {
  return (
    <>
      <Seo
        title="Votre Panier - SnipersMarket| Vérifiez vos articles avant l'achat"
        description="Consultez votre panier sur SnipersMarketet finalisez votre commande. Vérifiez vos articles et profitez d'une expérience d'achat fluide et sécurisée."
      />

      <Layout isDisplayCreadCrumbs={false}>
        <ShobLink />
        <CartTable />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
