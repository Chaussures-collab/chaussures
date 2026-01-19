/** @format */

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
// import { IoClose } from "react-icons/io5";
import Typography from "@/ui/designSystem/typography/typography";
import Container from "@/ui/components/container/container";
import Button from "@/ui/designSystem/button/button";
import { Category } from "@/hooks/useCategories";
import { useRouter } from "next/router";

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
  categories: Category[];
}

export default function ModernFilter({
  selectedCategory,
  setSelectedCategory,
  categories
}: ModernFilterProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterOpen, setIsDesktopFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");

  // Dédupliquer les catégories par nom et transformer en FilterOption
  const categoryOptions: FilterOption[] = useMemo(() => {
    // Dédupliquer les catégories par nom
    const uniqueCategories = categories.filter(
      (category, index, self) => index === self.findIndex((c) => c.nom === category.nom)
    );

    // Transformer les catégories de la base en format FilterOption
    return [
      { id: "all", label: "Tous les produits" },
      ...uniqueCategories.map((cat) => ({
        id: cat.nom,
        label: cat.nom
      }))
    ];
  }, [categories]);

  // Vérifier si le scroll est nécessaire et mettre à jour les flèches
  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, [categoryOptions, checkScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "right" ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth"
      });
    }
  };

  const brands = ["Nike", "Adidas", "Puma", "Reebok", "New Balance", "Converse"];
  const sortOptions = [
    { id: "default", label: "Par défaut" },
    { id: "price-asc", label: "Prix croissant" },
    { id: "price-desc", label: "Prix décroissant" },
    { id: "newest", label: "Plus récent" },
    { id: "popular", label: "Plus populaire" }
  ];

  const handleCategorySelect = (categoryId: string) => {
    let newCategory: string | null = null;

    if (categoryId === "all") {
      newCategory = null;
      setSelectedCategory(null);
    } else {
      // Même logique que la home : utiliser le nom de la catégorie comme identifiant
      newCategory = categoryId === selectedCategory ? null : categoryId;
      setSelectedCategory(newCategory);
    }

    // Mettre à jour l'URL pour garder un comportement identique à la home
    router.push(
      {
        pathname: "/shop",
        query: newCategory ? { category: newCategory } : {}
      },
      undefined,
      { shallow: true }
    );

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
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm md:top-22">
        <Container>
          <div className="flex justify-between items-center py-4">
            {/* Filtres desktop avec scroll horizontal */}
            <div className="flex-1 gap-2 items-center min-w-0">
              {/* <div className="flex flex-shrink-0 gap-2 items-center text-sm font-medium text-gray-700">
                <FiFilter size={18} />
                <span>Filtres :</span>
              </div> */}

              {/* Flèche gauche */}
              {showLeftArrow && (
                <button
                  onClick={() => scroll("left")}
                  className="flex-shrink-0 p-1 text-gray-600 rounded-full transition-colors hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Faire défiler vers la gauche">
                  <FiChevronLeft size={20} />
                </button>
              )}

              {/* Container avec scroll horizontal */}
              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto flex-1 gap-3 items-center min-w-0 scrollbar-hide">
                {categoryOptions.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      activeCategory === category.id
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}>
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Flèche droite */}
              {showRightArrow && (
                <button
                  onClick={() => scroll("right")}
                  className="flex-shrink-0 p-1 text-gray-600 rounded-full transition-colors hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Faire défiler vers la droite">
                  <FiChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Boutons filtres */}
            <div className="flex gap-3 items-center">
              {/* Bouton filtre mobile avec catégories directement visibles */}
              {/* <div className="lg:hidden flex-1 min-w-0">
                <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide pb-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 rounded-lg ${
                        activeCategory === category.id
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}>
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex gap-2 items-center px-4 py-2 font-medium text-gray-700 lg:hidden bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FiFilter size={18} />
                <span className="hidden sm:inline">Avancés</span>
              </button> */}

              {/* Bouton filtres avancés desktop */}
              <button
                onClick={() => setIsDesktopFilterOpen(true)}
                className="flex gap-2 items-center px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 transition hover:bg-gray-50">
                <FiFilter size={18} />
                <span>Filtres avancés</span>
              </button>
            </div>
          </div>

          {/* Badge catégorie active (mobile) */}
          {/* {selectedCategory && (
            <div className="pb-3 lg:hidden">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                <span>{selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="hover:bg-primary/20 rounded-full p-0.5">
                  <IoClose size={16} />
                </button>
              </div>
            </div>
          )} */}
        </Container>
      </div>

      {/* Modal filtres desktop (à droite) */}
      {isDesktopFilterOpen && (
        <div className="block fixed inset-0 z-50 pointer-events-none">
          {/* Overlay */}
          <div
            className="absolute inset-0 transition-opacity bg-black/50"
            onClick={() => setIsDesktopFilterOpen(false)}
          />

          {/* Panel à droite */}
          <div className="overflow-y-auto absolute top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform transform pointer-events-auto">
            {/* Header */}
            <div className="flex sticky top-0 z-10 justify-between items-center px-6 py-4 bg-white border-b border-gray-200">
              <Typography variant="h5" className="font-bold">
                Filtres avancés
              </Typography>
              <button
                onClick={() => setIsDesktopFilterOpen(false)}
                className="p-2 rounded-full transition hover:bg-gray-100">
                <FiX size={24} />
              </button>
            </div>

            {/* Contenu des filtres */}
            <div className="p-6 space-y-8">
              {/* Catégories */}
              <div>
                <Typography
                  variant="body"
                  className="mb-4 font-bold text-gray-900">
                  Catégories
                </Typography>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
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
                  className="mb-4 font-bold text-gray-900">
                  Fourchette de prix
                </Typography>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
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
                  <div className="flex gap-4 items-center">
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
                  <div className="text-sm text-center text-gray-600">
                    €{priceRange[0]} - €{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Marques */}
              <div>
                <Typography
                  variant="body"
                  className="mb-4 font-bold text-gray-900">
                  Marques
                </Typography>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex gap-3 items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
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
                  className="mb-4 font-bold text-gray-900">
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
            <div className="sticky bottom-0 p-6 space-y-3 bg-white border-t border-gray-200">
              <Button
                variant="suivant"
                action={() => setIsDesktopFilterOpen(false)}
                className="py-3 w-full">
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
                className="py-3 w-full">
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
            <div className="flex sticky top-0 justify-between items-center px-4 py-4 bg-white border-b border-gray-200">
              <Typography variant="h5" className="font-bold">
                Filtres
              </Typography>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100">
                <FiX size={24} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div>
                <Typography
                  variant="body"
                  className="mb-4 font-semibold text-gray-900">
                  Fourchette de prix
                </Typography>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
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
                  <div className="flex gap-4 items-center">
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
                  <div className="text-sm text-center text-gray-600 font-semibold">
                    €{priceRange[0]} - €{priceRange[1]}
                  </div>
                </div>
              </div>

              <div>
                <Typography
                  variant="body"
                  className="mb-4 font-semibold text-gray-900">
                  Marques
                </Typography>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex gap-3 items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
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
                  className="mb-4 font-semibold text-gray-900">
                  Trier par
                </Typography>
                <div className="space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setSortBy(option.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition ${
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

            {/* Bouton appliquer */}
            <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
              <Button
                // variant="primary"
                action={() => setIsMobileFilterOpen(false)}
                className="py-3 w-full">
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

