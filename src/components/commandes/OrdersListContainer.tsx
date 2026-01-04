/** @format */

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthUserContext";
import { OrderService } from "@/services/payment/order/OrderService";
import { OrderData } from "@/types/payment.types";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import OrderCard from "./OrderCard";
import { FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/router";

export default function OrdersListContainer() {
  const { authUser, authUserIsLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Rediriger si l'utilisateur n'est pas connecté
    if (!authUserIsLoading && !authUser) {
      router.push("/connexion");
      return;
    }

    // Charger les commandes
    const loadOrders = async () => {
      if (!authUser?.uid) return;

      try {
        setIsLoading(true);
        setError(null);
        const orderService = new OrderService();
        const userOrders = await orderService.getOrdersByUserId(authUser.uid);
        
        // Trier par date de création (plus récentes en premier)
        const sortedOrders = userOrders.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        
        setOrders(sortedOrders);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur s'est produite lors du chargement des commandes"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser?.uid) {
      loadOrders();
    }
  }, [authUser, authUserIsLoading, router]);

  if (authUserIsLoading || isLoading) {
    return (
      <Container className="py-12">
        <div className="flex flex-col justify-center items-center py-20">
          <div className="mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
          <Typography variant="body" className="text-gray-600">
            Chargement de vos commandes...
          </Typography>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <Typography variant="h5" className="mb-2 text-red-800">
            Erreur
          </Typography>
          <Typography variant="body" className="text-red-600">
            {error}
          </Typography>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 md:py-12">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex gap-3 items-center mb-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <FiShoppingBag className="text-primary" size={24} />
          </div>
          <div>
            <Typography variant="h2" className="font-bold text-gray-900">
              Mes commandes
            </Typography>
            <Typography variant="body-sm" className="mt-1 text-gray-600">
              {orders.length === 0
                ? "Aucune commande"
                : `${orders.length} ${orders.length === 1 ? "commande" : "commandes"}`}
            </Typography>
          </div>
        </div>
      </div>

      {/* Liste des commandes */}
      {orders.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-gray-200">
          <div className="flex flex-col justify-center items-center">
            <div className="p-4 mb-4 bg-gray-100 rounded-full">
              <FiShoppingBag className="text-gray-400" size={48} />
            </div>
            <Typography variant="h4" className="mb-2 font-bold text-gray-900">
              Aucune commande
            </Typography>
            <Typography variant="body" className="mb-6 max-w-md text-gray-600">
              Vous n&apos;avez pas encore passé de commande. Parcourez notre catalogue et
              commencez vos achats !
            </Typography>
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-3 font-semibold text-white rounded-lg transition-colors bg-primary hover:bg-primary-600">
              Découvrir nos produits
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </Container>
  );
}

