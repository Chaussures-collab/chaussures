/** @format */

import CartProduit from "@/components/home/produits/cartProduit";
import { dbProduits } from "@/components/home/produits/produitsDB";
import Container from "@/ui/components/container/container";
import Button from "@/ui/designSystem/button/button";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

/** @format */
interface ContainProps {
  produits: typeof dbProduits;
}

export default function Contain({ produits }: ContainProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(50);
  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = produits.slice(
    indexOfFirstProduct,  
    indexOfLastProduct
  );
  const totalPages = Math.ceil(produits.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    toast("Veuillez visiter nos multiples produits, y compris les vêtements.");
  });

  return (
    <Container className="my-8">
      <div className="grid grid-cols-2 m:grid-cols-4 lg:grid-cols-5 gap-3 justify-center gap-6 my-10">
        {currentProducts.map((produit, index) => (
          <CartProduit
            key={index}
            id={produit.id}
            src={produit.src}
            alt={produit.alt}
            nom={produit.nom}
            prix={produit.prix}
            promotion={produit.promotion ?? ""}
            description={produit.description}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2  ">
        <Button
          size="small"
          variant="suivant"
          action={() =>
            handlePageChange(currentPage > 1 ? currentPage - 1 : currentPage)
          }
          disabled={currentPage === 1}
        >
          Précédent
        </Button>

        {[...Array(totalPages)].map((_, index) => (
          <Button
            key={index}
            size="small"
            variant="suivant"
            action={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </Button>
        ))}

        <Button
          variant="suivant"
          size="small"
          action={() =>
            handlePageChange(
              currentPage < totalPages ? currentPage + 1 : currentPage
            )
          }
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    </Container>
  );
}
