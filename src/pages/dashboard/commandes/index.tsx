/** @format */

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import OrdersManagement from "@/components/dashboard/orders/OrdersManagement";
import AdminGuard from "@/components/dashboard/AdminGuard";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";

export default function AdminOrdersPage() {
  return (
    <Layout isDisplayCreadCrumbs={false}>
      <Seo title="Gestion des commandes - Dashboard" description="Gérer toutes les commandes" />
      <AdminGuard>
        <DashboardLayout>
          <OrdersManagement />
        </DashboardLayout>
      </AdminGuard>
    </Layout>
  );
}
