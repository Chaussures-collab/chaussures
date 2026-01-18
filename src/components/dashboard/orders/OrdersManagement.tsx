/** @format */

import React, { useState, useEffect } from "react";
import { OrderDocument } from "@/services/dashboard/AdminOrderService";
import Typography from "@/ui/designSystem/typography/typography";
import DataTable, { Column } from "../DataTable";
import Modal from "@/ui/designSystem/modal/Modal";
import { PaymentStatus } from "@/types/payment.types";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderDocument | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [shippingOrder, setShippingOrder] = useState<OrderDocument | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isShipping, setIsShipping] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/dashboard/orders");
        const data = await response.json();

        if (data.success && data.orders) {
          setOrders(data.orders);
        } else {
          setError(data.error || "Erreur lors du chargement");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  const handleViewOrder = (order: OrderDocument) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleShipOrder = (order: OrderDocument) => {
    setShippingOrder(order);
    setTrackingNumber("");
    setIsShippingModalOpen(true);
  };

  const handleConfirmShip = async () => {
    if (!shippingOrder) return;

    try {
      setIsShipping(true);
      setError(null);

      const response = await fetch("/api/shipping/manual-ship", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId: shippingOrder.id,
          trackingNumber: trackingNumber || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        // Recharger les commandes
        const refreshResponse = await fetch("/api/dashboard/orders");
        const refreshData = await refreshResponse.json();
        if (refreshData.success && refreshData.orders) {
          setOrders(refreshData.orders);
        }
        setIsShippingModalOpen(false);
        setShippingOrder(null);
        setTrackingNumber("");
      } else {
        setError(data.error || "Erreur lors de l'expédition");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'expédition"
      );
    } finally {
      setIsShipping(false);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const statusColors: Record<PaymentStatus, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PAID: "bg-blue-100 text-blue-800",
      FAILED: "bg-red-100 text-red-800",
      CANCELLED: "bg-gray-100 text-gray-800",
      REFUNDED: "bg-orange-100 text-orange-800",
      SHIPPED: "bg-purple-100 text-purple-800",
      DELIVERED: "bg-green-100 text-green-800"
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}>
        {status}
      </span>
    );
  };

  // Définir les colonnes de la table
  const columns: Column<OrderDocument>[] = [
    {
      id: "id",
      header: "ID Commande",
      accessor: (row) => (
        <span className="font-mono text-xs">{row.id.substring(0, 8)}...</span>
      ),
      className: "w-32"
    },
    {
      id: "userEmail",
      header: "Email",
      accessor: (row) => row.userEmail || "N/A",
      sortable: true
    },
    {
      id: "totalAmount",
      header: "Montant",
      accessor: (row) => (
        <span className="font-semibold text-primary">
          {row.totalAmount?.toFixed(2) || "0.00"} {row.currency || "EUR"}
        </span>
      ),
      sortable: true,
      className: "w-32"
    },
    {
      id: "items",
      header: "Articles",
      accessor: (row) => {
        const itemCount = row.items?.length || 0;
        return (
          <span>
            {itemCount} article{itemCount === 1 ? "" : "s"}
          </span>
        );
      },
      className: "w-24"
    },
    {
      id: "status",
      header: "Statut",
      accessor: (row) => getStatusBadge(row.status),
      sortable: true,
      className: "w-32"
    },
    {
      id: "paymentMethod",
      header: "Méthode",
      accessor: (row) => row.paymentMethod || "N/A",
      sortable: true,
      className: "w-32"
    },
    {
      id: "createdAt",
      header: "Date",
      accessor: (row) => {
        if (!row.createdAt) return "N/A";
        let date: Date;
        if (row.createdAt instanceof Date) {
          date = row.createdAt;
        } else if (row.createdAt?.toDate) {
          date = row.createdAt.toDate();
        } else {
          date = new Date();
        }
        return date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      },
      sortable: true,
      className: "w-40"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h2" className="mb-2 font-bold text-gray-900">
            Gestion des commandes
          </Typography>
          <Typography variant="body" className="text-gray-600">
            {orders.length} {orders.length === 1 ? "commande" : "commandes"}
          </Typography>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg border border-danger">
          <Typography variant="body" theme="red" className="text-danger">
            {error}
          </Typography>
        </div>
      )}

      {/* DataTable */}
      <DataTable
        data={orders}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher une commande (email, ID)..."
        searchKeys={["userEmail", "id"]}
        onEdit={handleViewOrder}
        emptyMessage="Aucune commande disponible."
        actionsLabel="Actions"
      />

      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        title={`Commande #${selectedOrder?.id.substring(0, 8)}`}>
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body-sm" className="mb-1 text-gray-500">
                  Email
                </Typography>
                <Typography variant="body" className="font-medium">
                  {selectedOrder.userEmail}
                </Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="mb-1 text-gray-500">
                  Statut
                </Typography>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <Typography variant="body-sm" className="mb-1 text-gray-500">
                  Montant total
                </Typography>
                <Typography
                  variant="body"
                  className="font-semibold text-primary">
                  {selectedOrder.totalAmount?.toFixed(2)}{" "}
                  {selectedOrder.currency}
                </Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="mb-1 text-gray-500">
                  Méthode de paiement
                </Typography>
                <Typography variant="body" className="font-medium">
                  {selectedOrder.paymentMethod}
                </Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="mb-1 text-gray-500">
                  Date de création
                </Typography>
                <Typography variant="body" className="font-medium">
                  {(() => {
                    if (selectedOrder.createdAt instanceof Date) {
                      return selectedOrder.createdAt.toLocaleString("fr-FR");
                    }
                    if (selectedOrder.createdAt?.toDate) {
                      return selectedOrder.createdAt
                        .toDate()
                        .toLocaleString("fr-FR");
                    }
                    return "N/A";
                  })()}
                </Typography>
              </div>
            </div>

            <div>
              <Typography variant="body-sm" className="mb-2 text-gray-500">
                Articles ({selectedOrder.items?.length || 0})
              </Typography>
              <div className="overflow-y-auto space-y-2 max-h-64">
                {selectedOrder.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <Typography variant="body" className="font-medium">
                        {item.name}
                      </Typography>
                      <Typography variant="body-sm" className="text-gray-500">
                        Quantité: {item.quantity} × {item.price?.toFixed(2)}{" "}
                        {selectedOrder.currency}
                      </Typography>
                    </div>
                    <Typography variant="body" className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)}{" "}
                      {selectedOrder.currency}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton Expédier si PAID */}
            {selectedOrder.status === "PAID" && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => handleShipOrder(selectedOrder)}
                  className="px-4 py-2 w-full font-medium text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700">
                  📦 Expédier la commande
                </button>
              </div>
            )}

            {/* Affichage numéro de suivi si déjà expédié */}
            {selectedOrder.status === "SHIPPED" && selectedOrder.trackingNumber && (
              <div className="pt-4 border-t">
                <Typography variant="body-sm" className="mb-1 text-gray-500">
                  Numéro de suivi
                </Typography>
                <Typography variant="body" className="font-mono font-semibold text-purple-600">
                  {selectedOrder.trackingNumber}
                </Typography>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal d'expédition */}
      <Modal
        isOpen={isShippingModalOpen}
        onClose={() => {
          setIsShippingModalOpen(false);
          setShippingOrder(null);
          setTrackingNumber("");
        }}
        title={`Expédier la commande #${shippingOrder?.id.substring(0, 8)}`}>
        {shippingOrder && (
          <div className="space-y-4">
            <Typography variant="body" className="text-gray-600">
              Voulez-vous expédier cette commande ? Un email de confirmation avec le numéro de suivi sera envoyé au client.
            </Typography>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Numéro de suivi (optionnel, généré automatiquement si vide)
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex: TRK240117123456"
                className="px-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleConfirmShip}
                disabled={isShipping}
                className="flex-1 px-4 py-2 font-medium text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isShipping ? "Expédition en cours..." : "Confirmer l'expédition"}
              </button>
              <button
                onClick={() => {
                  setIsShippingModalOpen(false);
                  setShippingOrder(null);
                  setTrackingNumber("");
                }}
                disabled={isShipping}
                className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-lg transition-colors hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                Annuler
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}