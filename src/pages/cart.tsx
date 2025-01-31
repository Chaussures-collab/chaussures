/** @format */

import CartTable from "@/components/cart/cartTable";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function cart() {
  return (
    <>
      <Seo title="Markets" description="Panier de la boutique" />

      <Layout isDisplayCreadCrumbs={false}>
        <ShobLink />
        <CartTable />
        <QualiteContainer />
      </Layout>
    </>
  );
}
