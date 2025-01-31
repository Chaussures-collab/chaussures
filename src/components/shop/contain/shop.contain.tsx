/** @format */
import React, { useState } from "react";
import { dbProduits } from "@/components/home/produits/produitsDB";
import Navbar from "../navbar/navbar";
import Contain from "./contain";
export const totalProduits = dbProduits.length;

export default function ShopContain() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts =
    selectedCategory === "Tous" || !selectedCategory
      ? dbProduits
      : dbProduits.filter((produit) => produit.categorie === selectedCategory);

  return (
    <>
      {/* Passer les props pour gérer la sélection de catégories */}
      <Navbar
        selectedCategory={selectedCategory} productsPerPage={filteredProducts.length}
        setSelectedCategory={setSelectedCategory}
      />
      <Contain produits={filteredProducts} />
    </>
  );
}
