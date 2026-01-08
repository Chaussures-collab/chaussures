/** @format */

import React, { useState, useEffect } from "react";
import { CategoryService, CategoryDocument } from "@/services/dashboard/CategoryService";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { FiPlus } from "react-icons/fi";
import CategoryModal from "./CategoryModal";
import Modal from "@/ui/designSystem/modal/Modal";
import DataTable, { Column } from "../DataTable";
import Image from "next/image";

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDocument | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const categoryService = new CategoryService();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: CategoryDocument) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      await categoryService.deleteCategory(categoryId);
      // Recharger les catégories
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const handleModalClose = async () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    // Recharger les catégories
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    }
  };

  // Définir les colonnes de la table
  const columns: Column<CategoryDocument>[] = [
    {
      id: "image",
      header: "Image",
      accessor: (row) => (
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
          {row.src ? (
            <Image
              src={row.src}
              alt={row.alt || row.nom || "Catégorie"}
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
      id: "description",
      header: "Description",
      accessor: (row) => (
        <div className="max-w-md">
          <Typography variant="body-sm" className="text-gray-700 line-clamp-2">
            {row.description || "Aucune description"}
          </Typography>
        </div>
      ),
      className: "max-w-md"
    },
    {
      id: "createdAt",
      header: "Date de création",
      accessor: (row) => {
        if (!row.createdAt) return "N/A";
        const date = row.createdAt instanceof Date 
          ? row.createdAt 
          : row.createdAt?.toDate 
            ? row.createdAt.toDate() 
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography variant="h2" className="mb-2 font-bold text-gray-900">
            Gestion des catégories
          </Typography>
          <Typography variant="body" className="text-gray-600">
            {categories.length}{" "}
            {categories.length === 1 ? "catégorie" : "catégories"}
          </Typography>
        </div>
        <Button
          action={handleCreate}
          variant="accent"
          iconPosition="left"
          icon={{ icon: FiPlus }}
          className="flex gap-2 items-center">
          Ajouter une catégorie
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
        data={categories}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher une catégorie..."
        searchKeys={["nom"]}
        onEdit={handleEdit}
        onDelete={(category) => category.id && setDeleteConfirm(category.id)}
        emptyMessage="Aucune catégorie disponible. Commencez par ajouter votre première catégorie."
      />

      {/* Create/Edit Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        category={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Confirmer la suppression">
        <div className="space-y-4">
          <Typography variant="body" className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action
            est irréversible.
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
              className="flex-1 text-white bg-red-500 hover:bg-red-600">
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}