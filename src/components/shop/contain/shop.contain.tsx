/** @format */
import React, { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ModernFilter from "../filters/ModernFilter";
import Contain from "./contain";
import { useRouter } from "next/router";

export default function ShopContain() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, isLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Initialiser la catégorie depuis l'URL (ex: /shop?category=Chaussures)
  useEffect(() => {
    const categoryFromQuery = router.query.category;
    if (typeof categoryFromQuery === "string" && categoryFromQuery.trim() !== "") {
      setSelectedCategory(categoryFromQuery);
    }
  }, [router.query.category]);

  const filteredProducts =
    !selectedCategory || selectedCategory === "all"
      ? products
      : products.filter((produit) => produit.categorie === selectedCategory);

  // Mélange aléatoire plus évolué (Fisher-Yates) pour l'affichage
  const shuffledProducts = React.useMemo(() => {
    const arr = [...filteredProducts];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [filteredProducts]);

  const totalProduits = products.length;

  if (isLoading || categoriesLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Nouveau système de filtrage moderne */}
      <ModernFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        productsPerPage={filteredProducts.length}
        totalProducts={totalProduits}
        categories={categories}
      />
      <Contain produits={shuffledProducts} />
    </>
  );
}
