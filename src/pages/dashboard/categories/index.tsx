/** @format */

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CategoriesManagement from "@/components/dashboard/categories/CategoriesManagement";
import AdminGuard from "@/components/dashboard/AdminGuard";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";

export default function CategoriesDashboardPage() {
  return (
    <Layout isDisplayCreadCrumbs={false}>
      <Seo title="Gestion des catégories - Dashboard" description="Gérer vos catégories" />
      <AdminGuard>
        <DashboardLayout>
          <CategoriesManagement />
        </DashboardLayout>
      </AdminGuard>
    </Layout>
  );
}

