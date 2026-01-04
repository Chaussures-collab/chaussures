/** @format */

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from "@/ui/designSystem/modal/Modal";
import { Input } from "@/ui/designSystem/forms/input";
import Button from "@/ui/designSystem/button/button";
import FormError from "@/ui/designSystem/forms/FormError";
import { CategoryService, CategoryDocument } from "@/services/dashboard/CategoryService";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: CategoryDocument | null;
}

interface CategoryFormData {
  nom: string;
  src: string;
  alt: string;
  description?: string;
}

export default function CategoryModal({
  isOpen,
  onClose,
  category
}: CategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categoryService = new CategoryService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<CategoryFormData>({
    defaultValues: {
      nom: category?.nom || "",
      src: category?.src || "",
      alt: category?.alt || "",
      description: category?.description || ""
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({
          nom: category.nom || "",
          src: category.src || "",
          alt: category.alt || "",
          description: category.description || ""
        });
      } else {
        reset({
          nom: "",
          src: "",
          alt: "",
          description: ""
        });
      }
      setError(null);
    }
  }, [isOpen, category, reset]);

  const onSubmit: SubmitHandler<CategoryFormData> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const categoryData: Omit<CategoryDocument, "id" | "createdAt" | "updatedAt"> = {
        nom: data.nom,
        src: data.src,
        alt: data.alt || data.nom,
        description: data.description
      };

      if (category?.id) {
        await categoryService.updateCategory(category.id, categoryData);
      } else {
        await categoryService.createCategory(categoryData);
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? "Modifier la catégorie" : "Ajouter une catégorie"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormError message={error || undefined} />

        <Input<CategoryFormData>
          id="nom"
          label="Nom de la catégorie"
          type="text"
          placeholder="Nom de la catégorie"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="Le nom est requis"
        />

        <Input<CategoryFormData>
          id="src"
          label="URL de l'image"
          type="text"
          placeholder="/assets/images/category.jpg"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="L'URL de l'image est requise"
        />

        <Input<CategoryFormData>
          id="alt"
          label="Texte alternatif de l'image"
          type="text"
          placeholder="Description de l'image"
          register={register}
          errors={errors}
          watch={watch}
        />

        <Input<CategoryFormData>
          id="description"
          label="Description"
          type="text"
          placeholder="Description de la catégorie (optionnel)"
          register={register}
          errors={errors}
          watch={watch}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            action={onClose}
            className="flex-1"
            disabled={isLoading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="flex-1"
            isLoading={isLoading}
            disabled={isLoading}>
            {category ? "Enregistrer les modifications" : "Créer la catégorie"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

