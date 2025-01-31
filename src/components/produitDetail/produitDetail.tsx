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

/* interface ColorOption {
  name: string; // Nom de la couleur (ex. "Rouge")
  code: string; // Code CSS de la couleur (ex. "bg-red-500")
  icon?: JSX.Element; // Optionnel : Icône associée à la couleur
} */

interface ProduitDetailProps {
  produit: ProduitType;
}

export default function ProduitDetail({ produit }: ProduitDetailProps) {
  // Appel de `useCart` au bon endroit (dans le composant fonctionnel)
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | number | null>(
    null
  );

  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();

  const updateQuantity = (amount: number) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  /* const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    setQuantity(isNaN(newQuantity) || newQuantity < 1 ? 1 : newQuantity);
  }; */

  const handleAddToCart = () => {
    if (selectedColor && selectedSize) {
      addToCart({ ...produit, quantity, selectedColor, selectedSize });
      console.log(
        `Produit ajouté : ID ${produit.id}, Quantité : ${quantity}, Couleur : ${selectedColor}, Taille : ${selectedSize}`
      );
    }
  };
  // Gestion de l'ajout au panier

  return (
    <div className="flex flex-col gap-4 w-full sm:w-auto">
      <Typography variant="h3" component="h3">
        {produit.nom}
      </Typography>
      <div>
        {produit.promotion ? (
          <div className="flex items-center gap-2">
            <Typography
              variant="body"
              component="span"
              className="font-bold text-green-600"
            >
              {produit.promotion}€
            </Typography>
            <Typography
              variant="body"
              component="span"
              className="line-through text-gray-4"
            >
              {produit.prix}€
            </Typography>
          </div>
        ) : (
          <Typography variant="body" component="p" className="text-gray-800">
            {produit.prix}€
          </Typography>
        )}
      </div>
      <div className="flex space-x-2 text-yellow-500">
        <div className="flex items-center gap-1">
          <RiStarFill className="text-yellow " />
          <RiStarFill className="text-yellow " />
          <RiStarFill className="text-yellow " />
          <RiStarFill className="text-yellow " />
          <RiStarFill className="text-yellow " />
        </div>
        <div className="text-gray-4">| 4.5 avis des clients</div>
      </div>
      <Typography
        variant="body"
        component="p"
        className="max-w-[500px] text-justify"
      >
        {produit.description}
      </Typography>
      <hr className="my-2 border-gray-4" />

      {/* Couleur */}
      <div className="space-y-4">
        <Typography variant="body" className="text-gray-4">
          Sélectionnez la couleur
        </Typography>
        <div className="flex gap-4">
          {produit.colors.map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full ${
                selectedColor === color.name ? "ring-2 ring-primary" : ""
              }`}
              style={{ backgroundColor: color.code }} // Applique la couleur spécifique
              onClick={() => setSelectedColor(color.name)}
              aria-label={`Choisir la couleur ${color.name}`}
            ></button>
          ))}
        </div>
      </div>

      <hr className="my-2 border-gray-4" />

      {/* Taille */}
      <div className="space-y-2">
        <Typography variant="body" className="text-gray-4">
          Sélectionnez la taille
        </Typography>
        <div className="flex gap-4">
          {produit.sizes.map((size, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded ${
                selectedSize === size
                  ? "bg-primary text-white"
                  : "bg-primary-1 text-gray-600"
              }`}
              onClick={() => setSelectedSize(size)}
              aria-label={`Choisir la taille ${size}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 items-center gap-4">
        <Typography variant="body" className="text-gray-4">
          Sélectionnez la quantitée
        </Typography>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => updateQuantity(1)} // Augmente la quantité
              className="rounded bg-primary text-white items-center px-5 w-12 hover:shadow hover hover:scale-105 h-12"
            >
              +
            </button>
            {/* Sélecteur de quantité */}
            <input
              type="number"
              min="1"
              className="w-16 h-12 text-center border rounded border-primary"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
              }
              aria-label={`Quantité pour ${produit.nom}`}
            />
            <button
              onClick={() => updateQuantity(-1)} // Diminue la quantité
              className="rounded bg-primary text-white items-center px-5 w-12 hover:shadow hover hover:scale-105 h-12"
            >
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
              disabled={!selectedColor || !selectedSize}
              aria-label={`Ajouter ${quantity} ${produit.nom} au panier`}
            >
              Ajouter au panier
            </Button>
            <Button
              size="small"
              className="rounded"
              disabled={!selectedColor || !selectedSize}
              aria-label={`Ajouter ${quantity} ${produit.nom} au panier`}
            >
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
