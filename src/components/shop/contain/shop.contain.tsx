/** @format */
import React, { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ModernFilter from "../filters/ModernFilter";
import Contain from "./contain";

export default function ShopContain() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { products, isLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const filteredProducts =
    !selectedCategory || selectedCategory === "all"
      ? products
      : products.filter((produit) => produit.categorie === selectedCategory);

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
      <Contain produits={filteredProducts} />
    </>
  );
}
