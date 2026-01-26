/** @format */
import React, { useEffect, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ModernFilter from "../filters/ModernFilter";
import Contain from "./contain";
import { useRouter } from "next/router";
import Container from "@/ui/components/container/container";

export default function ShopContain() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { products, isLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();

  // Initialiser la catégorie depuis l'URL (ex: /shop?category=Chaussures)
  useEffect(() => {
    const categoryFromQuery = router.query.category;
    if (typeof categoryFromQuery === "string" && categoryFromQuery.trim() !== "") {
      setSelectedCategory(categoryFromQuery);
    } else {
      setSelectedCategory(null);
    }
  }, [router.query.category]);

  // Initialiser la recherche depuis l'URL (ex: /shop?search=chaussures)
  useEffect(() => {
    const searchFromQuery = router.query.search;
    if (typeof searchFromQuery === "string" && searchFromQuery.trim() !== "") {
      setSearchQuery(searchFromQuery.trim());
    } else {
      setSearchQuery("");
    }
  }, [router.query.search]);

  // Filtrer les produits par catégorie ET par recherche
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Filtre par catégorie
    if (selectedCategory && selectedCategory !== "all" && selectedCategory !== "Tous") {
      filtered = filtered.filter((produit) => produit.categorie === selectedCategory);
    }

    // Filtre par recherche (nom, description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((produit) => {
        const nomMatch = produit.nom?.toLowerCase().includes(query);
        const descriptionMatch = produit.description?.toLowerCase().includes(query);
        const categorieMatch = produit.categorie?.toLowerCase().includes(query);
        return nomMatch || descriptionMatch || categorieMatch;
      });
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

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
      
      {/* Affichage des filtres actifs */}
      {(searchQuery || selectedCategory) && (
        <div className="bg-gray-50 border-b border-gray-200 py-3">
        <Container>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filtres actifs :</span>
            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white">
                Recherche: &quot;{searchQuery}&quot;
                <button
                  onClick={() => {
                    const newQuery = { ...router.query };
                    delete newQuery.search;
                    router.push({ pathname: "/shop", query: newQuery });
                  }}
                  className="ml-2 hover:text-gray-200"
                  aria-label="Supprimer la recherche">
                  ×
                </button>
              </span>
            )}
            {selectedCategory && selectedCategory !== "all" && selectedCategory !== "Tous" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-500 text-white">
                Catégorie: {selectedCategory}
                <button
                  onClick={() => {
                    const newQuery = { ...router.query };
                    delete newQuery.category;
                    router.push({ pathname: "/shop", query: newQuery });
                  }}
                  className="ml-2 hover:text-gray-200"
                  aria-label="Supprimer la catégorie">
                  ×
                </button>
              </span>
            )}
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => router.push("/shop")}
                className="text-sm text-primary hover:underline">
                Effacer tous les filtres
              </button>
            )}
          </div>
        </Container>
      </div>
      )}
      
      <Contain produits={shuffledProducts} />
    </>
  );
}
