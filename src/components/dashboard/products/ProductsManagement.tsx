/** @format */

import React, { useState, useEffect } from "react";
import {
  ProductService,
  ProductDocument
} from "@/services/dashboard/ProductService";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { FiPlus } from "react-icons/fi";
import ProductModal from "./ProductModal";
import Modal from "@/ui/designSystem/modal/Modal";
import DataTable, { Column } from "../DataTable";
import Image from "next/image";
import { normalizeImagePath } from "@/utils/imageUtils";

export default function ProductsManagement() {
  const [products, setProducts] = useState<ProductDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDocument | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const productService = new ProductService();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: ProductDocument) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await productService.deleteProduct(productId);
      // Recharger les produits
      const data = await productService.getAllProducts();
      setProducts(data);
      setDeleteConfirm(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression"
      );
    }
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    // Recharger les produits
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement"
      );
    }
  };
const isDate = (value: unknown): value is Date => {
  return value instanceof Date;
};

  // Définir les colonnes de la table
  const columns: Column<ProductDocument>[] = [
    {
      id: "image",
      header: "Image",
      accessor: (row) => (
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
          {row.src ? (
            <Image
              src={normalizeImagePath(row.src)}
              alt={row.alt || row.nom || "Produit"}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-gray-400 text-xs">Aucune image</span>
            </div>
          )}
        </div>
      ),
      className: "w-24"
    },
    {
      id: "nom",
      header: "Nom",
      accessor: (row) => row.nom || "Sans nom",
      sortable: true
    },
    {
      id: "categorie",
      header: "Catégorie",
      accessor: (row) => row.categorie || "Non catégorisé",
      sortable: true
    },
    {
      id: "prix",
      header: "Prix",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary">
            €{row.prix?.toFixed(2) || "0.00"}
          </span>
          {row.prixPromo && (
            <span className="text-sm text-green-600">
              Promo: €{row.prixPromo.toFixed(2)}
            </span>
          )}
        </div>
      ),
      sortable: true,
      className: "w-32"
    },
    {
      id: "stock",
      header: "Stock",
      accessor: (row) => (
        <span
          className={
            row.quantiteStock && row.quantiteStock > 0
              ? "text-gray-900"
              : "text-red-600"
          }>
          {row.quantiteStock || 0}
        </span>
      ),
      sortable: true,
      className: "w-24"
    },
    {
      id: "dateAjout",
      header: "Date d'ajout",
      accessor: (row) => {
        if (!row.dateAjout) return "N/A";

        const date =
          typeof row.dateAjout === "string"
            ? new Date(row.dateAjout)
            : isDate(row.dateAjout)
            ? row.dateAjout
            : new Date();

        return date.toLocaleDateString("fr-FR");
      },
      sortable: true,
      className: "w-32"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h2" className="font-bold text-gray-900 mb-2">
            Gestion des produits
          </Typography>
          <Typography variant="body" className="text-gray-600">
            {products.length} {products.length === 1 ? "produit" : "produits"}
          </Typography>
        </div>
        <Button
          action={handleCreate}
          variant="accent"
          className="flex items-center gap-2">
          <FiPlus size={20} />
          Ajouter un produit
        </Button>
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
        data={products}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un produit (nom, catégorie)..."
        searchKeys={["nom", "categorie"]}
        onEdit={handleEdit}
        onDelete={(product) => product.id && setDeleteConfirm(product.id)}
        emptyMessage="Aucun produit disponible. Commencez par ajouter votre premier produit."
      />

      {/* Create/Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmer la suppression">
        <div className="space-y-4">
          <Typography variant="body" className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est
            irréversible.
          </Typography>
          <div className="flex gap-3">
            <Button
              action={() => setDeleteConfirm(null)}
              variant="outline"
              className="flex-1">
              Annuler
            </Button>
            <Button
              action={() => deleteConfirm && handleDelete(deleteConfirm)}
              variant="ico"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white">
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}