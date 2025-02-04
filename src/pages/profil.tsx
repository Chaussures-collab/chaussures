/** @format */

import ProfilContainer from "@/components/profil/profil.container";
import Paiement from "@/components/shop/paiement/paiement";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function Profil() {
  return (
    <>
      <Seo
        title="Mon Profil - ShopiMarket | Gérez votre compte"
        description="Accédez à votre profil ShopiMarket pour gérer vos informations personnelles, suivre vos commandes et modifier vos préférences."
      />
      <Layout isDisplayCreadCrumbs={false}>
        <ShobLink />
        <ProfilContainer />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
