/** @format */

import React, { useState } from "react";
import Image from "next/image";
import { OrderData } from "@/types/payment.types";
import Typography from "@/ui/designSystem/typography/typography";
import {
  FiChevronDown,
  FiChevronUp,
  FiPackage,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTruck
} from "react-icons/fi";

interface OrderCardProps {
  order: OrderData;
}

export default function OrderCard({ order }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Formater la date
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      return dateObj.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Date invalide";
    }
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      PAID: {
        label: "Payée",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <FiCheckCircle className="text-green-600" size={16} />
      },
      PENDING: {
        label: "En attente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <FiClock className="text-yellow-600" size={16} />
      },
      FAILED: {
        label: "Échouée",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <FiXCircle className="text-red-600" size={16} />
      },
      SHIPPED: {
        label: "Expédiée",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <FiTruck className="text-blue-600" size={16} />
      },
      DELIVERED: {
        label: "Livrée",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <FiPackage className="text-purple-600" size={16} />
      }
    };

    const config = statusConfig[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <FiPackage className="text-gray-600" size={16} />
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  // Calculer le nombre total d'articles
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* En-tête de la carte */}
      <div
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Informations principales */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Typography variant="h5" className="font-bold text-gray-900">
                Commande #{order.id.substring(0, 8).toUpperCase()}
              </Typography>
              {getStatusBadge(order.status)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="text-gray-400" size={16} />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiPackage className="text-gray-400" size={16} />
                <span>
                  {totalItems} {totalItems === 1 ? "article" : "articles"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FiCreditCard className="text-gray-400" size={16} />
                <span className="capitalize">{order.paymentMethod || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Typography variant="body" className="font-bold text-primary">
                  {order.totalAmount.toFixed(2)} {order.currency?.toUpperCase() || "EUR"}
                </Typography>
              </div>
            </div>
          </div>

          {/* Bouton d'expansion */}
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            aria-label={isExpanded ? "Réduire" : "Développer"}>
            {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
          </button>
        </div>
      </div>

      {/* Contenu détaillé (expandable) */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="p-6 space-y-6">
            {/* Liste des produits */}
            <div>
              <Typography variant="h5" className="font-semibold text-gray-900 mb-4">
                Articles commandés
              </Typography>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200">
                    {/* Image du produit */}
                    {item.imageUrl && (
                      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    )}

                    {/* Détails du produit */}
                    <div className="flex-1 min-w-0">
                      <Typography variant="body" className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </Typography>
                      {item.description && (
                        <Typography variant="caption1" className="text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </Typography>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>Quantité: {item.quantity}</span>
                        <span className="font-semibold text-gray-900">
                          {item.price.toFixed(2)} {order.currency?.toUpperCase() || "EUR"}
                        </span>
                      </div>
                    </div>

                    {/* Prix total de l'article */}
                    <div className="flex-shrink-0 text-right">
                      <Typography variant="body" className="font-bold text-primary">
                        {(item.price * item.quantity).toFixed(2)}{" "}
                        {order.currency?.toUpperCase() || "EUR"}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FiCreditCard className="text-gray-400" size={16} />
                  <span>
                    Paiement: <span className="font-semibold capitalize">{order.paymentMethod || "N/A"}</span>
                  </span>
                </div>
                {order.stripeSessionId && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Session Stripe: {order.stripeSessionId.substring(0, 20)}...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-4">
                <div className="text-right">
                  <Typography variant="caption1" className="text-gray-600 mb-1">
                    Total de la commande
                  </Typography>
                  <Typography variant="h4" className="font-bold text-primary">
                    {order.totalAmount.toFixed(2)} {order.currency?.toUpperCase() || "EUR"}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

