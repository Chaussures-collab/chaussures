/** @format */

import ProfilContainer from "@/components/profil/profil.container";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function Profil() {
  return (
    <>
      <Seo title="Markets" description="E-commerce" />
      <Layout isDisplayCreadCrumbs={false}>
        <ShobLink />
        <ProfilContainer />
        <QualiteContainer />
      </Layout>
    </>
  );
}
