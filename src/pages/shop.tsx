/** @format */

import ShopContain from "@/components/shop/contain/shop.contain";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function Shop() {
  return (
    <>
      <Seo title="Boutique" description="Présentaion de nos produits" />

      <Layout isDisplayCreadCrumbs={false}>
        <ShobLink /><ShopContain/>
        <QualiteContainer/>
      </Layout>
    </>
  );
}
