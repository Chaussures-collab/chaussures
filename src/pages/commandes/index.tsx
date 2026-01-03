/** @format */

import React from "react";
import OrdersListContainer from "@/components/commandes/OrdersListContainer";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";

export default function CommandesPage() {
  return (
      <Layout isDisplayCreadCrumbs={false}>
      <Seo title="Markets" description="E-commerce" />
      <OrdersListContainer />
    </Layout>
  );
}

