/** @format */

import ContactContainer from "@/components/contact/contact.container";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import ShobLink from "@/components/shop/shobLink/shobLink";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import React from "react";

export default function Contact() {
  return (
    <>
      <Seo title="Markets" description="Contactez-nous" />

      <Layout isDisplayCreadCrumbs={false}>
        <ShobLink />
        <ContactContainer />
        <QualiteContainer />
      </Layout>
    </>
  );
}
