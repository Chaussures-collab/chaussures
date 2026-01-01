/** @format */

import React from "react";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import Container from "@/ui/components/container/container";
import CartTotal from "./cartTotal";
import Typography from "@/ui/designSystem/typography/typography";
import { useCart } from "@/context/cartContext";
import Button from "@/ui/designSystem/button/button";
import { useRouter } from "next/router";

export default function CartTable() {
  const { cart, updateCartItem, removeCartItem } = useCart();
  const router = useRouter();

  const calculateTotal = () => {
    return cart.reduce(
      (acc, item) =>
        acc + (Number(item.prix) || 0) * (Number(item.quantity) || 0),
      0
    );
  };

  const handleQuantityChange = (id: string | number, value: number) => {
    if (value > 0) {
      updateCartItem(String(id), value);
    }
  };

  const handleDelete = (id: string | number) => {
    removeCartItem(String(id));
  };

  const handleContinueShopping = () => {
    router.push("/shop");
  };

  if (cart.length === 0) {
    return (
      <Container className="py-24">
        <div className="flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
          <div className="w-32 h-32 flex items-center justify-center rounded-full bg-primary-50">
            <FiShoppingBag size={48} className="text-primary" />
          </div>
          <Typography variant="h3" className="font-bold text-gray-900">
            Votre panier est vide
          </Typography>
          <Typography
            variant="body"
            className="text-gray-500 max-w-md mx-auto">
            Parcourez notre catalogue et ajoutez des articles à votre panier
            pour commencer vos achats.
          </Typography>
          <Button
            variant="outline"
            action={handleContinueShopping}
            className="px-8 py-3">
            Continuer mes achats
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="mb-6">
        <Typography variant="h2" className="font-bold text-gray-900">
          Mon Panier
        </Typography>
        <Typography variant="body" className="text-gray-600 mt-2">
          {cart.length} {cart.length > 1 ? "articles" : "article"} dans votre
          panier
        </Typography>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Liste des produits */}
        <div className="lg:w-2/3 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image du produit */}
                <div className="relative w-full sm:w-32 h-32 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Informations du produit */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <Typography
                        variant="h4"
                        className="font-semibold text-gray-900 mb-2">
                        {item.alt}
                      </Typography>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        {item.selectedSize && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Taille:</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {item.selectedSize}
                            </span>
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="flex items-center gap-1">
                            <span className="font-medium">Couleur:</span>
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {item.selectedColor}
                            </span>
                          </span>
                        )}
                      </div>

                      <Typography className="text-xl font-bold text-primary">
                        € {item.prix.toFixed(2)}
                      </Typography>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                      aria-label="Supprimer l'article">
                      <RiDeleteBinLine size={22} />
                    </button>
                  </div>

                  {/* Contrôle de quantité */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Number(item.quantity) - 1
                          )
                        }
                        disabled={Number(item.quantity) <= 1}
                        className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition">
                        <FiMinus size={18} />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[60px] text-center border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Number(item.quantity) + 1
                          )
                        }
                        className="px-3 py-2 hover:bg-gray-100 transition">
                        <FiPlus size={18} />
                      </button>
                    </div>

                    <Typography className="text-lg font-bold text-gray-900">
                      € {((Number(item.prix) || 0) * (Number(item.quantity) || 0)).toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total du panier */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <CartTotal totalAmount={calculateTotal()} />
          </div>
        </div>
      </div>
    </Container>
  );
}
