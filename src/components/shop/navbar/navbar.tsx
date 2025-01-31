/** @format */

import { useState } from "react";
import { IoColorFilterOutline } from "react-icons/io5";
import { RiCloseFill, RiColorFilterFill } from "react-icons/ri";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { totalProduits } from "../contain/shop.contain";

// Interfaces pour les props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface NavbarProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  productsPerPage: number;
}

// Constantes globales
const categories = ["Tous", "Produit", "Chaussure", "Maison", "Alimentation"];
//const productsPerPage = 16; // Projection par défaut
//const totalProduits = 120; // Nombre total de produits

// Composant Modal
function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      /* aria-hidden={!isOpen} */
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-4/5 sm:w-1/2">
        <div className="flex justify-between items-center border-b pb-3">
          <Typography variant="h5">Catégories</Typography>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Fermer le modal"
          >
            <RiCloseFill size={24} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

// Composant Navbar
export default function Navbar({
  selectedCategory,
  setSelectedCategory,
  productsPerPage,
}: NavbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setIsModalOpen(false); // Ferme le modal après sélection
  };

  const renderCategoryButton = (category: string) => (
    <Button
      key={category}
      action={() => handleCategoryClick(category)}
      className={`px-4 py-2 m-1 rounded-md ${
        selectedCategory === category
          ? "bg-blue-500 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
    >
      {category}
    </Button>
  );

  return (
    <>
      {/* Barre de navigation */}
      <Container className="flex items-center sticky top-30 md:top-20 z-50 justify-between h-16 bg-primary-1">
        <Typography
          variant="caption1"
          className="flex space-x-4 items-center mx-4"
        >
          <Typography component="span">Filtre</Typography>
          <Button  action={toggleModal} aria-label="Afficher le filtre">
            {isModalOpen ? (
              <RiColorFilterFill size={24} />
            ) : (
              <IoColorFilterOutline size={24} />
            )}
          </Button>
          <Typography className="hidden sm:flex" component="span">
            | Projection de {productsPerPage} sur {totalProduits} produits
          </Typography>
        </Typography>

        <Typography className="hidden sm:pb-4 sm:flex">
          Affiche{" "}
          <input
            type="text"
            disabled
            value='8'
            className="w-auto px-2 bg-white text-gray-3 max-w-10"
          />{" "}
          partie par{" "}
          <input
            type="text"
            disabled
            value="défaut"
            className="w-auto px-2 bg-white text-gray-3 max-w-20"
          />
        </Typography>

        <Typography className="sm:hidden pb-5 me-4" component="span">
          Projection de {productsPerPage} sur {totalProduits} produits
        </Typography>
      </Container>

      {/* Catégorie sélectionnée */}
      <Container >
        {selectedCategory && (
          <div className="mt-4 text-center">
            <Typography variant="body">
              Catégorie sélectionnée : <strong>{selectedCategory}</strong>
            </Typography>
          </div>
        )}
      </Container>

      {/* Modal pour les catégories */}
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <Typography variant="body" component="span">
          Sélectionnez une catégorie :
        </Typography>
        <div className="flex flex-wrap mt-2">
          {categories.map(renderCategoryButton)}
        </div>
        {selectedCategory && (
          <div className="mt-4 text-center">
            <Typography variant="body">
              Catégorie sélectionnée : <strong>{selectedCategory}</strong>
            </Typography>
          </div>
        )}
      </Modal>
    </>
  );
}
