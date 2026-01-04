/** @format */

import Typography from "@/ui/designSystem/typography/typography";
import { FiPackage, FiTag, FiShoppingBag, FiTrendingUp } from "react-icons/fi";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface DashboardStats {
  products: number;
  categories: number;
  orders: number;
  totalSales: number;
}

export default function DashboardHome() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    orders: 0,
    totalSales: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();

        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          console.error("Erreur lors du chargement des statistiques:", data.error);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsCards = [
    {
      label: "Produits",
      value: isLoading ? "..." : stats.products.toString(),
      icon: FiPackage,
      color: "bg-blue-500",
      path: "/dashboard/produits"
    },
    {
      label: "Catégories",
      value: isLoading ? "..." : stats.categories.toString(),
      icon: FiTag,
      color: "bg-green-500",
      path: "/dashboard/categories"
    },
    {
      label: "Commandes",
      value: isLoading ? "..." : stats.orders.toString(),
      icon: FiShoppingBag,
      color: "bg-purple-500",
      path: "/dashboard/commandes"
    },
    {
      label: "Ventes",
      value: isLoading ? "..." : `€${stats.totalSales.toFixed(2)}`,
      icon: FiTrendingUp,
      color: "bg-orange-500",
      path: "/dashboard/commandes"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Typography variant="h2" className="mb-2 font-bold text-gray-900">
          Tableau de bord
        </Typography>
        <Typography variant="body" className="text-gray-600">
          Gérez vos produits, catégories et commandes
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <button
              key={stat.label}
              onClick={() => router.push(stat.path)}
              className="p-6 text-left bg-white rounded-xl border border-gray-200 transition-shadow hover:shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div className={`p-3 ${stat.color} rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <Typography variant="h3" className="mb-1 font-bold text-gray-900">
                {stat.value}
              </Typography>
              <Typography variant="body-sm" className="text-gray-600">
                {stat.label}
              </Typography>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-white rounded-xl border border-gray-200">
        <Typography variant="h4" className="mb-4 font-bold text-gray-900">
          Actions rapides
        </Typography>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => router.push("/dashboard/produits?action=create")}
            type="button"
            className="flex gap-3 items-center p-4 rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
            <FiPackage className="text-gray-400" size={24} />
            <div className="text-left">
              <Typography
                variant="body"
                className="font-semibold text-gray-900">
                Ajouter un produit
              </Typography>
              <Typography variant="caption1" className="text-gray-500">
                Créer un nouveau produit
              </Typography>
            </div>
          </button>
          <button
            onClick={() => router.push("/dashboard/categories?action=create")}
            type="button"
            className="flex gap-3 items-center p-4 rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-primary hover:bg-primary/5">
            <FiTag className="text-gray-400" size={24} />
            <div className="text-left">
              <Typography
                variant="body"
                className="font-semibold text-gray-900">
                Ajouter une catégorie
              </Typography>
              <Typography variant="caption1" className="text-gray-500">
                Créer une nouvelle catégorie
              </Typography>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}