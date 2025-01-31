/** @format */

import React from "react";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";
import Container from "@/ui/components/container/container";
import CartTotal from "./cartTotal";
import Typography from "@/ui/designSystem/typography/typography";
import { useCart } from "@/context/cartContext";

export default function CartTable() {
  const { cart, updateCartItem, removeCartItem } = useCart(); // Gestion via le contexte

 const calculateTotal = () => {
  return cart.reduce((acc, item) => 
    acc + (Number(item.prix) || 0) * (Number(item.quantity) || 0), 0);
};


  const handleQuantityChange = (id: string | number, value: number) => {
    if (value > 0) {
      updateCartItem(String(id), value); // Conversion explicite en string
    }
  };

  const handleDelete = (id: string | number) => {
    removeCartItem(String(id)); // Conversion explicite en string
  };

  console.log(cart);

  return (
    <Container className="flex flex-col sm:flex-rows gap-8 shadow bg-white md:flex-row p-6 md:justify-between md:items-start">
      {/* Liste des produits */}
      <div className="bg-primary-1 w-full p-6 rounded-lg mt-9 shadow md:w-3/5 space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b border-primary pb-4 last:border-none"
          >
            {/* Image du produit */}
            <div className="relative h-16 w-16 md:h-24 md:w-24 overflow-hidden rounded-lg">
              <Image
                src={item.src}
                alt={item.alt}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>

            {/* Informations du produit */}
            <div className="flex-1 ml-4">
              <div className="flex items-center justify-between">
                <Typography variant="h4" className="truncate text-primary">
                  {item.alt}
                </Typography>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                  aria-label="Supprimer l'article"
                >
                  <RiDeleteBinLine size={24} className="text-primary" />
                </button>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <Typography variant="body">
                  Taille :{" "}
                  <span className="text-gray-600">{item.selectedSize}</span>
                </Typography>
                <Typography variant="body">
                  Couleur :{" "}
                  <span className="text-gray-600">{item.selectedColor}</span>
                </Typography>
              </div>

              <div className="flex items-center justify-between mt-4">
                <Typography className="text-lg font-semibold text-gray-800">
                  € {item.prix.toFixed(2)}
                </Typography>
                <input
                  type="number"
                  min="1"
                  className="w-16 text-center border border-gray-300 rounded"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total du panier */}
      <div className="w-full md:w-1/3 p-4">
        <CartTotal totalAmount={calculateTotal()} />
      </div>
    </Container>
  );
}
