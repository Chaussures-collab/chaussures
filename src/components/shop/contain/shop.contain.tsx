/** @format */
import React, { useState } from "react";
import { dbProduits } from "@/components/home/produits/produitsDB";
import ModernFilter from "../filters/ModernFilter";
import Contain from "./contain";

export const totalProduits = dbProduits.length;

export default function ShopContain() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts =
    !selectedCategory || selectedCategory === "all"
      ? dbProduits
      : dbProduits.filter((produit) => produit.categorie === selectedCategory);

  return (
    <>
      {/* Nouveau système de filtrage moderne */}
      <ModernFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        productsPerPage={filteredProducts.length}
        totalProducts={totalProduits}
      />
      <Contain produits={filteredProducts} />
    </>
  );
}
