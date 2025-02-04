/** @format */

import CheckoutContainer from "@/components/checkout/checkout.container";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import { REGISTERED } from "@/lib/session-status";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function Checkout() {
  return (
    <>
      <Seo
        title="Paiement sécurisé - ShopiMarket | Finalisez votre achat"
        description="Procédez au paiement en toute sécurité sur ShopiMarket. Options de paiement variées et cryptage sécurisé pour une transaction sans souci."
      />

      <Layout sessionStatus={REGISTERED} isDisplayCreadCrumbs={false}>
        <ShobLink />
        <CheckoutContainer />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
