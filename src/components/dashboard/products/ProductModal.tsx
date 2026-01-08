/** @format */

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from "@/ui/designSystem/modal/Modal";
import { Input } from "@/ui/designSystem/forms/input";
import Button from "@/ui/designSystem/button/button";
import FormError from "@/ui/designSystem/forms/FormError";
import Typography from "@/ui/designSystem/typography/typography";
import { ProductService, ProductDocument } from "@/services/dashboard/ProductService";
import { CategoryService } from "@/services/dashboard/CategoryService";
import Image from "next/image";
import { normalizeImagePath } from "@/utils/imageUtils";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductDocument | null;
}

interface ProductFormData {
  nom: string;
  description: string;
  description1: string;
  prix: number;
  prixPromo?: number;
  quantiteStock: number;
  categorie: string;
  src: string;
  alt: string;
  sizesInput?: string; // Pour l'input des tailles (séparées par des virgules)
  colorsInput?: string; // Pour l'input des couleurs (format: nom:code, nom:code)
}

interface Color {
  id: number;
  name: string;
  code: string;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ id: string; nom: string }>>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [newSize, setNewSize] = useState("");
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#000000");
  const [supplementaryImages, setSupplementaryImages] = useState<Array<{ id: number; src: string; alt: string }>>([]);
  const [newImageSrc, setNewImageSrc] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");
  const productService = new ProductService();
  const categoryService = new CategoryService();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProductFormData>({
    defaultValues: {
      nom: product?.nom || "",
      description: product?.description || "",
      description1: product?.description1 || "",
      prix: product?.prix || 0,
      prixPromo: product?.prixPromo || undefined,
      quantiteStock: product?.quantiteStock || 0,
      categorie: product?.categorie || "",
      src: product?.src || "",
      alt: product?.alt || ""
    }
  });

  useEffect(() => {
    if (isOpen) {
      const loadCategories = async () => {
        try {
          const cats = await categoryService.getAllCategories();
          setCategories(cats.map((cat) => ({ id: cat.id || "", nom: cat.nom })));
        } catch (err) {
          console.error("Erreur lors du chargement des catégories:", err);
        }
      };
      loadCategories();
      if (product) {
        reset({
          nom: product.nom || "",
          description: product.description || "",
          description1: product.description1 || "",
          prix: product.prix || 0,
          prixPromo: product.prixPromo || undefined,
          quantiteStock: product.quantiteStock || 0,
          categorie: product.categorie || "",
          src: product.src || "",
          alt: product.alt || ""
        });
        setSizes(product.sizes || []);
        setColors(product.colors || []);
        // Normaliser les chemins des images existantes
        setSupplementaryImages((product.images || []).map(img => ({
          ...img,
          src: normalizeImagePath(img.src)
        })));
      } else {
        reset({
          nom: "",
          description: "",
          description1: "",
          prix: 0,
          prixPromo: undefined,
          quantiteStock: 0,
          categorie: "",
          src: "",
          alt: ""
        });
        setSizes([]);
        setColors([]);
        setSupplementaryImages([]);
      }
      setNewSize("");
      setNewColorName("");
      setNewColorCode("#000000");
      setNewImageSrc("");
      setNewImageAlt("");
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, product, reset]);

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construire l'objet produit en omettant les champs undefined
      const productData: Record<string, unknown> = {
        nom: data.nom,
        description: data.description,
        description1: data.description1,
        prix: Number(data.prix),
        quantiteStock: Number(data.quantiteStock),
        categorie: data.categorie,
        src: normalizeImagePath(data.src),
        alt: data.alt || data.nom,
        images: supplementaryImages.map(img => ({
          ...img,
          src: normalizeImagePath(img.src)
        })),
        colors: colors,
        sizes: sizes,
        dateAjout: new Date().toISOString()
      };

      // Ajouter prixPromo seulement s'il a une valeur
      if (data.prixPromo && Number(data.prixPromo) > 0) {
        productData.prixPromo = Number(data.prixPromo);
      }

      if (product?.id) {
        await productService.updateProduct(product.id, productData as Partial<ProductDocument>);
      } else {
        await productService.createProduct(productData as Omit<ProductDocument, "id" | "createdAt" | "updatedAt">);
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
      title={product ? "Modifier le produit" : "Ajouter un produit"}
      size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormError message={error || undefined} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input<ProductFormData>
            id="nom"
            label="Nom du produit"
            type="text"
            placeholder="Nom du produit"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le nom est requis"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Catégorie <span className="text-danger">*</span>
            </label>
            <select
              {...register("categorie", { required: "La catégorie est requise" })}
              className="px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.nom}>
                  {cat.nom}
                </option>
              ))}
            </select>
            {errors.categorie && (
              <Typography variant="caption1" className="text-red-600">
                {errors.categorie.message}
              </Typography>
            )}
          </div>
        </div>

        <Input<ProductFormData>
          id="description"
          label="Description"
          type="text"
          placeholder="Description du produit"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="La description est requise"
        />

        <Input<ProductFormData>
          id="description1"
          label="Description secondaire"
          type="text"
          placeholder="Description secondaire (optionnel)"
          register={register}
          errors={errors}
          watch={watch}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input<ProductFormData>
            id="prix"
            label="Prix (€)"
            type="number"
            placeholder="0.00"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le prix est requis"
            validationRules={{
              min: { value: 0, message: "Le prix doit être positif" }
            }}
          />

          <Input<ProductFormData>
            id="prixPromo"
            label="Prix promotionnel (€)"
            type="number"
            placeholder="0.00"
            register={register}
            errors={errors}
            watch={watch}
            required={false}
            validationRules={{
              min: { value: 0, message: "Le prix doit être positif" }
            }}
          />

          <Input<ProductFormData>
            id="quantiteStock"
            label="Quantité en stock"
            type="number"
            placeholder="0"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="La quantité est requise"
            validationRules={{
              min: { value: 0, message: "La quantité doit être positive" }
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input<ProductFormData>
            id="src"
            label="URL de l'image principale"
            type="text"
            placeholder="/assets/images/product.jpg"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="L'URL de l'image est requise"
          />

          <Input<ProductFormData>
            id="alt"
            label="Texte alternatif de l'image"
            type="text"
            placeholder="Description de l'image"
            register={register}
            errors={errors}
            watch={watch}
          />
        </div>

        {/* Gestion des images supplémentaires */}
        <div className="space-y-4">
          <Typography variant="h5" className="font-semibold text-gray-900">
            Images supplémentaires
          </Typography>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={newImageSrc}
              onChange={(e) => setNewImageSrc(e.target.value)}
              placeholder="/assets/images/image-supplementaire.jpg"
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
                placeholder="Description de l'image"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                type="button"
                variant="outline"
                action={() => {
                  if (newImageSrc.trim()) {
                    const newImage = {
                      id: supplementaryImages.length + 1,
                      src: normalizeImagePath(newImageSrc.trim()),
                      alt: newImageAlt.trim() || `Image ${supplementaryImages.length + 1}`
                    };
                    setSupplementaryImages([...supplementaryImages, newImage]);
                    setNewImageSrc("");
                    setNewImageAlt("");
                  }
                }}>
                Ajouter
              </Button>
            </div>
          </div>
          {supplementaryImages.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4 sm:grid-cols-3 md:grid-cols-4">
              {supplementaryImages.map((image, index) => (
                <div
                  key={image.id || index}
                  className="overflow-hidden relative bg-gray-50 rounded-lg border border-gray-200 group">
                  <div className="relative aspect-square">
                    {image.src ? (
                      <Image
                        src={normalizeImagePath(image.src)}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        unoptimized={image.src.startsWith("http://") || image.src.startsWith("https://")}
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-full text-xs text-gray-400">
                        Aucune image
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-gray-600 truncate">{image.alt}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSupplementaryImages(supplementaryImages.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 text-white bg-red-600 rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gestion des tailles */}
        <div className="space-y-4">
          <Typography variant="h5" className="font-semibold text-gray-900">
            Tailles disponibles
          </Typography>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => (
              <div
                key={index}
                className="flex gap-2 items-center px-3 py-1 rounded-lg bg-primary/10">
                <span className="text-sm font-medium text-gray-900">{size}</span>
                <button
                  type="button"
                  onClick={() => setSizes(sizes.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="Ex: S, M, L, XL"
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newSize.trim() && !sizes.includes(newSize.trim())) {
                    setSizes([...sizes, newSize.trim()]);
                    setNewSize("");
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              action={() => {
                if (newSize.trim() && !sizes.includes(newSize.trim())) {
                  setSizes([...sizes, newSize.trim()]);
                  setNewSize("");
                }
              }}>
              Ajouter
            </Button>
          </div>
        </div>

        {/* Gestion des couleurs */}
        <div className="space-y-4">
          <Typography variant="h5" className="font-semibold text-gray-900">
            Couleurs disponibles
          </Typography>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div
                key={color.id || index}
                className="flex gap-2 items-center px-3 py-1 bg-gray-50 rounded-lg border border-gray-200">
                <div
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.code }}
                />
                <span className="text-sm font-medium text-gray-900">{color.name}</span>
                <button
                  type="button"
                  onClick={() => setColors(colors.filter((_, i) => i !== index))}
                  className="text-red-600 hover:text-red-800">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              placeholder="Nom de la couleur"
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={newColorCode}
                onChange={(e) => setNewColorCode(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={newColorCode}
                onChange={(e) => setNewColorCode(e.target.value)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              action={() => {
                if (newColorName.trim() && newColorCode.trim()) {
                  const newColor: Color = {
                    id: colors.length + 1,
                    name: newColorName.trim(),
                    code: newColorCode.trim()
                  };
                  setColors([...colors, newColor]);
                  setNewColorName("");
                  setNewColorCode("#000000");
                }
              }}>
              Ajouter
            </Button>
          </div>
        </div>

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
            {product ? "Enregistrer les modifications" : "Créer le produit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

