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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h2" className="font-bold text-gray-900 mb-2">
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
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Email
                </Typography>
                <Typography variant="body" className="font-medium">
                  {selectedOrder.userEmail}
                </Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Statut
                </Typography>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <Typography variant="body-sm" className="text-gray-500 mb-1">
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
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Méthode de paiement
                </Typography>
                <Typography variant="body" className="font-medium">
                  {selectedOrder.paymentMethod}
                </Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="text-gray-500 mb-1">
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
              <Typography variant="body-sm" className="text-gray-500 mb-2">
                Articles ({selectedOrder.items?.length || 0})
              </Typography>
              <div className="space-y-2 max-h-64 overflow-y-auto">
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
          </div>
        )}
      </Modal>
    </div>
  );
}