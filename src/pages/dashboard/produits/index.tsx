/** @format */

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ProductsManagement from "@/components/dashboard/products/ProductsManagement";
import AdminGuard from "@/components/dashboard/AdminGuard";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";

export default function ProductsDashboardPage() {
  return (
    <Layout isDisplayCreadCrumbs={false}>
      <Seo title="Gestion des produits - Dashboard" description="Gérer vos produits" />
      <AdminGuard>
        <DashboardLayout>
          <ProductsManagement />
        </DashboardLayout>
      </AdminGuard>
    </Layout>
  );
}

