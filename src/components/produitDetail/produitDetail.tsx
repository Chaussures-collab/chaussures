/** @format */

import React, { useState } from "react";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import {
  RiFacebookBoxFill,
  RiLinkedinBoxFill,
  RiStarFill,
  RiTwitterFill
} from "react-icons/ri";
import { ProduitType } from "@/types/produitType";
import { useCart } from "@/context/cartContext";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import ColorGallery from "./ColorGallery";

interface ProduitDetailProps {
  produit: ProduitType;
}

export default function ProduitDetail({ produit }: ProduitDetailProps) {
  const route = useRouter();
  const { addToCart } = useCart();

  // Seules certaines catégories ont des variantes taille/couleur
  const hasVariants = ["Chaussures", "Vêtements", "Vetements", "Survetements"].includes(
    produit.categorie
  );

  // Appel de `useCart` au bon endroit (dans le composant fonctionnel)
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    null
  );
  const handlePage = () => {
    // Si le produit a des variantes, on exige couleur et taille
    if (hasVariants) {
      if (!selectedColor) {
        setShowColorError(true);
      }
      if (!selectedSize) {
        setShowSizeError(true);
      }
      
      if (!selectedColor || !selectedSize) {
        toast.error(
          "Veuillez choisir une couleur et une taille pour ajouter au panier."
        );
        return;
      }
    }

    const itemId = hasVariants && selectedColor && selectedSize
      ? `${produit.id}-${selectedSize}-${selectedColor}`
      : `${produit.id}`;

    addToCart({
      ...produit,
      quantity,
      selectedColor: hasVariants ? selectedColor ?? undefined : undefined,
      selectedSize: hasVariants ? selectedSize ?? undefined : undefined,
      id: itemId
    });

    console.log(
      `Produit ajouté : ID ${produit.id}, Quantité : ${quantity}, Couleur : ${selectedColor}, Taille : ${selectedSize}`
    );

    route.push("/checkout");
  };
  const [quantity, setQuantity] = useState(1);

  const updateQuantity = (amount: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };
  /* const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity);
  }; */

  const [showColorError, setShowColorError] = useState(false);
  const [showSizeError, setShowSizeError] = useState(false);

  const handleAddToCart = () => {
    // Si le produit a des variantes, on exige couleur et taille
    if (hasVariants) {
      if (!selectedColor) {
        setShowColorError(true);
      }
      if (!selectedSize) {
        setShowSizeError(true);
      }

      // Si l'un des champs est manquant, ne pas continuer
      if (!selectedColor || !selectedSize) {
        toast.error(
          "Veuillez choisir une couleur et une taille pour ajouter au panier."
        );
        return;
      }

      // Réinitialiser les erreurs si tout est OK
      setShowColorError(false);
      setShowSizeError(false);
    }

    const itemId = hasVariants && selectedColor && selectedSize
      ? `${produit.id}-${selectedSize}-${selectedColor}`
      : `${produit.id}`;

    addToCart({
      ...produit,
      quantity,
      selectedColor: hasVariants ? selectedColor ?? undefined : undefined,
      selectedSize: hasVariants ? selectedSize ?? undefined : undefined,
      id: itemId
    });

    toast.success(
      `Produit ajouté : Nom : ${produit.nom}, Quantité : ${quantity}${
        hasVariants ? `, Couleur : ${selectedColor}, Taille : ${selectedSize}` : ""
      }`
    );
  };
  // Gestion de l'ajout au panier

  return (
    <div className="flex flex-col gap-4 w-full sm:w-auto">
      <Typography variant="h3" component="h3">
        {produit.nom}
      </Typography>
      <div>
        {produit.promotion ? (
          <div className="flex gap-2 items-center">
            <Typography
              variant="body"
              component="span"
              className="font-bold text-green-600">
              {produit.promotion}€
            </Typography>
            <Typography
              variant="body"
              component="span"
              className="line-through text-gray-4">
              {produit.prix}€
            </Typography>
          </div>
        ) : (
          <Typography variant="body" component="p" className="text-gray-800">
            {produit.prix}€
          </Typography>
        )}
      </div>
      <div className="flex flex-wrap gap-3 items-center text-yellow-500">
        <div className="flex gap-1 items-center">
          <RiStarFill className="text-yellow" />
          <RiStarFill className="text-yellow" />
          <RiStarFill className="text-yellow" />
          <RiStarFill className="text-yellow" />
          <RiStarFill className="text-yellow" />
        </div>
        <div className="text-gray-4">| 4.5 avis des clients</div>
        {/* Stock */}
        <div className="ml-auto text-sm">
          {produit.quantiteStock && produit.quantiteStock > 0 ? (
            <span className="font-medium text-green-600">
              En stock : {produit.quantiteStock}
            </span>
          ) : (
            <span className="font-medium text-red-600">Rupture de stock</span>
          )}
        </div>
      </div>
      <Typography
        variant="body"
        component="p"
        className="max-w-[500px] text-justify">
        {produit.description}
      </Typography>
      <hr className="my-2 border-gray-4" />

      {/* Couleur / taille uniquement pour chaussures & vêtements */}
      {hasVariants && (
        <>
          {/* Couleur avec galerie améliorée */}
          <div>
            <ColorGallery
              colors={produit.colors}
              selectedColor={selectedColor}
              onColorSelect={(color) => {
                setSelectedColor(color);
                setShowColorError(false);
              }}
              showError={showColorError}
            />
          </div>

          <hr className="my-2 border-gray-4" />

          {/* Taille */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Typography variant="body" className="text-gray-4">
                Sélectionnez la taille
              </Typography>
            </div>
            <div className="flex flex-wrap gap-4">
              {produit.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded transition-all ${
                    selectedSize === size
                      ? "bg-primary text-white shadow-md scale-105"
                      : "bg-primary-50 text-gray-400 hover:bg-primary-100"
                  }`}
                  onClick={() => {
                    setSelectedSize(size);
                    setShowSizeError(false);
                  }}
                  aria-label={`Choisir la taille ${size}`}>
                  {size}
                </button>
              ))}
            </div>
            {showSizeError && !selectedSize && (
              <div className="flex gap-2 items-center mt-2 text-sm text-danger animate-fadeIn">
                <svg
                  className="flex-shrink-0 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Veuillez sélectionner une taille</span>
              </div>
            )}
          </div>
        </>
      )}

      <div className="gap-4 items-center space-y-2">
        <Typography variant="body" className="text-gray-4">
          Sélectionnez la quantité
        </Typography>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => updateQuantity(1)} // Augmente la quantité
              className="items-center px-5 w-12 h-12 text-white rounded bg-primary hover:shadow hover hover:scale-105">
              +
            </button>
            {/* Sélecteur de quantité */}
            <input
              type="number"
              min="1"
              className="w-16 h-12 text-center rounded border border-primary"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              aria-label={`Quantité pour ${produit.nom}`}
            />
            <button
              onClick={() => updateQuantity(-1)} // Diminue la quantité
              className="items-center px-5 w-12 h-12 text-white rounded bg-primary hover:shadow hover hover:scale-105">
              -
            </button>
          </div>

          <div className="flex space-x-1">
            {/* Bouton Ajouter au panier */}
            <Button
              variant="outline"
              size="small"
              action={handleAddToCart}
              className="w-[156px] rounded"
              //disabled={!selectedColor || !selectedSize}
              aria-label={`Ajouter ${quantity} ${produit.nom} au panier`}>
              Ajouter au panier
            </Button>
            <Button
              size="small"
              action={handlePage}
              className="rounded"
              //disabled={!selectedColor || !selectedSize}
              aria-label={`Ajouter ${quantity} ${produit.nom} au panier`}>
              Commander
            </Button>
          </div>
        </div>
      </div>
      <hr className="my-2 border-gray-4" />
      <div>
        <table>
          <tbody>
            <tr>
              <td>Catégorie </td>
              <td> : {produit.categorie}</td>
            </tr>
            <tr>
              <td>Partager</td>
              <td>
                <div className="flex gap-2">
                  {"  "}
                  : <RiFacebookBoxFill className="mt-1" />{" "}
                  <RiLinkedinBoxFill className="mt-1" />
                  <RiTwitterFill className="mt-1" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <Typography variant="body" component="h5" className="text-gray-4">
          Information sur la pointure
        </Typography>
        <Typography variant="body" component="div" className="text-gray">
          Prenez une taille au-dessus de votre pointure habituelle
        </Typography>
      </div>
    </div>
  );
}
