/** @format */

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import AdminGuard from "@/components/dashboard/AdminGuard";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";

export default function DashboardPage() {
  return (
    <Layout isDisplayCreadCrumbs={false}>
      <Seo title="Dashboard - ShopiMarket" description="Gestion des produits et catégories" />
      <AdminGuard>
        <DashboardLayout>
          <DashboardHome />
        </DashboardLayout>
      </AdminGuard>
    </Layout>
  );
}

