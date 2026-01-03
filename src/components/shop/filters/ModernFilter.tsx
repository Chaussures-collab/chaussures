/** @format */

import React, { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import Typography from "@/ui/designSystem/typography/typography";
import Container from "@/ui/components/container/container";
import Button from "@/ui/designSystem/button/button";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ModernFilterProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  productsPerPage: number;
  totalProducts: number;
}

const categories: FilterOption[] = [
  { id: "all", label: "Tous les produits" },
  { id: "Chaussures", label: "Chaussures" },
  { id: "Doudoune", label: "Doudoune" },
  { id: "Survetement", label: "Survetement" },
  { id: "Veste", label: "Veste" }
];

export default function ModernFilter({
  selectedCategory,
  setSelectedCategory
}: ModernFilterProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");

  const brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Converse"];
  const sortOptions = [
    { id: "default", label: "Par défaut" },
    { id: "price-asc", label: "Prix croissant" },
    { id: "price-desc", label: "Prix décroissant" },
    { id: "newest", label: "Plus récent" },
    { id: "popular", label: "Plus populaire" }
  ];

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === "all") {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    }
    setIsMobileFilterOpen(false);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const activeCategory = selectedCategory || "all";

  return (
    <>
      {/* Barre de filtres sticky (Desktop) */}
      <div className="sticky md:top-22 top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <Container>
          <div className="flex items-center justify-between py-4">
            {/* Filtres desktop */}
            <div className="hidden lg:flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <FiFilter size={18} />
                <span>Filtres :</span>
              </div>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    activeCategory === category.id
                      ? "bg-primary text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>
                  {category.label}
                </button>
              ))}
            </div>

            {/* Boutons filtres */}
            <div className="flex items-center gap-3">
              {/* Bouton filtre mobile */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium">
                <FiFilter size={18} />
                <span>Filtres</span>
                {selectedCategory && (
                  <span className="bg-white text-primary w-5 h-5 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                )}
              </button>

              {/* Bouton filtres avancés desktop */}
              <button
                onClick={() => setIsDesktopFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300  hover:bg-gray-50 transition text-gray-700 font-medium">
                <FiFilter size={18} />
                <span>Filtres avancés</span>
              </button>

              {/* Compteur de résultats */}
              {/* <div className="text-sm text-gray-600">
                <span className="font-semibold text-primary">{productsPerPage}</span>
                {" sur "}
                <span className="font-semibold">{totalProducts}</span>
                {" produits"}
              </div> */}
            </div>
          </div>

          {/* Badge catégorie active (mobile) */}
          {selectedCategory && (
            <div className="lg:hidden pb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="hover:bg-primary/20 rounded-full p-0.5">
                  <IoClose size={16} />
                </button>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Modal filtres desktop (à droite) */}
      {isDesktopFilterOpen && (
        <div className="block fixed inset-0 z-50 pointer-events-none">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setIsDesktopFilterOpen(false)}
          />

          {/* Panel à droite */}
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl overflow-y-auto pointer-events-auto transform transition-transform">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <Typography variant="h5" className="font-bold">
                Filtres avancés
              </Typography>
              <button
                onClick={() => setIsDesktopFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition">
                <FiX size={24} />
              </button>
            </div>

            {/* Contenu des filtres */}
            <div className="p-6 space-y-8">
              {/* Catégories */}
              <div>
                <Typography
                  variant="body"
                  className="font-bold mb-4 text-gray-900">
                  Catégories
                </Typography>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                        activeCategory === category.id
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <Typography
                  variant="body"
                  className="font-bold mb-4 text-gray-900">
                  Fourchette de prix
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                      €{priceRange[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                      €{priceRange[1]}
                    </span>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    €{priceRange[0]} - €{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Marques */}
              <div>
                <Typography
                  variant="body"
                  className="font-bold mb-4 text-gray-900">
                  Marques
                </Typography>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
                      />
                      <Typography variant="body" className="text-gray-700">
                        {brand}
                      </Typography>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tri */}
              <div>
                <Typography
                  variant="body"
                  className="font-bold mb-4 text-gray-900">
                  Trier par
                </Typography>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                        sortBy === option.id
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer avec boutons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 space-y-3">
              <Button
                variant="suivant"
                action={() => setIsDesktopFilterOpen(false)}
                className="w-full py-3">
                Appliquer les filtres
              </Button>
              <Button
                variant="outline"
                action={() => {
                  setSelectedCategory(null);
                  setPriceRange([0, 1000]);
                  setSelectedBrands([]);
                  setSortBy("default");
                }}
                className="w-full py-3">
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal filtres mobile */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
              <Typography variant="h5" className="font-bold">
                Filtres
              </Typography>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <Typography variant="body" className="font-semibold mb-4">
                  Catégories
                </Typography>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
                        activeCategory === category.id
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bouton appliquer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <Button
                // variant="primary"
                action={() => setIsMobileFilterOpen(false)}
                className="w-full py-3">
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

