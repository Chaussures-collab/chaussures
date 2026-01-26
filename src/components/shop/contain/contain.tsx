/** @format */

import CartProduit from "@/components/home/produits/cartProduit";
import { ProduitType } from "@/types/produitType";
import Container from "@/ui/components/container/container";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { 
  HiChevronLeft, 
  HiChevronRight, 
  HiChevronDoubleLeft, 
  HiChevronDoubleRight 
} from "react-icons/hi";
import clsx from "clsx";

/** @format */
interface ContainProps {
  produits: ProduitType[];
}

export default function Contain({ produits }: ContainProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(50);
  
  // Options pour le nombre de produits par page
  const itemsPerPageOptions = [12, 24, 50, 100];
  
  // Initialiser depuis l'URL
  useEffect(() => {
    const pageFromQuery = router.query.page;
    const perPageFromQuery = router.query.perPage;
    
    if (pageFromQuery && typeof pageFromQuery === "string") {
      const page = parseInt(pageFromQuery, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
    
    if (perPageFromQuery && typeof perPageFromQuery === "string") {
      const perPage = parseInt(perPageFromQuery, 10);
      if (!isNaN(perPage) && itemsPerPageOptions.includes(perPage)) {
        setProductsPerPage(perPage);
      }
    }
  }, [router.query]);
  
  // Réinitialiser à la page 1 si le nombre total de pages change et que la page actuelle est invalide
  useEffect(() => {
    const totalPages = Math.ceil(produits.length / productsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
      const newQuery = { ...router.query, page: "1" };
      router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
    }
  }, [produits.length, productsPerPage]);
  
  // Pagination
  const totalPages = Math.ceil(produits.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = produits.slice(
    indexOfFirstProduct,  
    indexOfLastProduct
  );
  
  // Calculer la plage affichée
  const startItem = produits.length > 0 ? indexOfFirstProduct + 1 : 0;
  const endItem = Math.min(indexOfLastProduct, produits.length);
  
  const handlePageChange = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
    
    // Mettre à jour l'URL
    const newQuery = { ...router.query, page: validPage.toString() };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  const handlePerPageChange = (perPage: number) => {
    setProductsPerPage(perPage);
    setCurrentPage(1); // Réinitialiser à la première page
    
    // Mettre à jour l'URL
    const newQuery = { ...router.query, perPage: perPage.toString(), page: "1" };
    router.push({ pathname: router.pathname, query: newQuery }, undefined, { shallow: true });
  };
  
  // Générer les numéros de page à afficher avec ellipsis
  const getPageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Nombre maximum de pages visibles
    
    if (totalPages <= maxVisible) {
      // Afficher toutes les pages si le total est petit
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logique avec ellipsis
      if (currentPage <= 3) {
        // Début de la liste
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin de la liste
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Milieu de la liste
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);
  
  useEffect(() => {
    toast("Veuillez visiter nos multiples produits, y compris les vêtements.");
  }, []);

  return (
    <Container className="my-8">
      <div className="grid grid-cols-2 m:grid-cols-4 lg:grid-cols-5 gap-3 justify-center gap-6 my-10">
        {currentProducts.map((produit) => (
          <CartProduit
            key={produit.id}
            id={produit.id}
            src={produit.src}
            alt={produit.alt}
            nom={produit.nom}
            prix={produit.prix}
            promotion={produit.promotion ?? ""}
            description={produit.description}
            date={produit.dateAjout}
          />
        ))}
      </div>

      {/* Informations et contrôles de pagination */}
      {produits.length > 0 && (
        <div className="mt-8 space-y-4">
          {/* Barre d'information et sélecteur */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <Typography variant="caption2" className="text-gray-600">
                Affichage de <span className="font-semibold text-gray-900">{startItem}</span> à{" "}
                <span className="font-semibold text-gray-900">{endItem}</span> sur{" "}
                <span className="font-semibold text-gray-900">{produits.length}</span> produits
              </Typography>
              
              {/* Sélecteur de produits par page */}
              <div className="flex items-center gap-2">
                <Typography variant="caption2" className="text-gray-600 whitespace-nowrap">
                  Afficher :
                </Typography>
                <select
                  value={productsPerPage}
                  onChange={(e) => handlePerPageChange(parseInt(e.target.value, 10))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all">
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <Typography variant="caption2" className="text-gray-600 whitespace-nowrap">
                  par page
                </Typography>
              </div>
            </div>
          </div>

          {/* Pagination moderne */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* Boutons de navigation */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Premier */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={clsx(
                    "p-2 rounded-md transition-all duration-200",
                    "flex items-center justify-center",
                    currentPage === 1 ?
                      "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-600 hover:bg-primary hover:text-white bg-white border border-gray-300 hover:border-primary"
                  )}
                  aria-label="Première page">
                  <HiChevronDoubleLeft size={20} />
                </button>

                {/* Précédent */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={clsx(
                    "p-2 rounded-md transition-all duration-200",
                    "flex items-center justify-center",
                    currentPage === 1 ?
                      "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-600 hover:bg-primary hover:text-white bg-white border border-gray-300 hover:border-primary"
                  )}
                  aria-label="Page précédente">
                  <HiChevronLeft size={20} />
                </button>

                {/* Numéros de page */}
                <div className="flex items-center gap-1">
                  {getPageNumbers.map((page, index) => {
                    if (page === "ellipsis") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 py-1 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    
                    const pageNum = page as number;
                    const isActive = currentPage === pageNum;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={clsx(
                          "min-w-[40px] px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                          isActive ?
                            "bg-primary text-white shadow-md scale-105"
                          : "text-gray-700 hover:bg-primary hover:text-white bg-white border border-gray-300 hover:border-primary"
                        )}
                        aria-label={`Page ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Suivant */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={clsx(
                    "p-2 rounded-md transition-all duration-200",
                    "flex items-center justify-center",
                    currentPage === totalPages ?
                      "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-600 hover:bg-primary hover:text-white bg-white border border-gray-300 hover:border-primary"
                  )}
                  aria-label="Page suivante">
                  <HiChevronRight size={20} />
                </button>

                {/* Dernier */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={clsx(
                    "p-2 rounded-md transition-all duration-200",
                    "flex items-center justify-center",
                    currentPage === totalPages ?
                      "text-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-gray-600 hover:bg-primary hover:text-white bg-white border border-gray-300 hover:border-primary"
                  )}
                  aria-label="Dernière page">
                  <HiChevronDoubleRight size={20} />
                </button>
              </div>

              {/* Indicateur de page */}
              <Typography variant="caption2" className="text-gray-600">
                Page <span className="font-semibold text-gray-900">{currentPage}</span> sur{" "}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </Typography>
            </div>
          )}
        </div>
      )}
      
      {/* Message si aucun produit */}
      {produits.length === 0 && (
        <div className="text-center py-12">
          <Typography variant="h5" className="text-gray-500 mb-2">
            Aucun produit trouvé
          </Typography>
          <Typography variant="body" className="text-gray-400">
            Essayez de modifier vos filtres de recherche
          </Typography>
        </div>
      )}
    </Container>
  );
}
