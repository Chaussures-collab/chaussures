/**
 * @format
 * 
 * Hook personnalisé pour gérer le checkout
 * Utilise le nouveau système de paiement SOLID
 */

import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/AuthUserContext";
import { PaymentItem } from "@/types/payment.types";

export const useCheckout = () => {
  const { authUser } = useAuth();
  const { cart, updateCartItem, removeCartItem/*,  calculateTotalPromoPrice */ } =
    useCart();

  const [isLoading, setIsLoading] = useState(false);

  /**
   * Gère le paiement via Stripe
   */
  const handleStripeCheckout = async () => {
    if (!authUser) {
      toast.error("Veuillez vous connecter avant de passer la commande.");
      return;
    }

    if (!cart || cart.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    try {
      setIsLoading(true);

      // Transformation des items du panier en PaymentItem
      const items: PaymentItem[] = cart.map((item) => ({
        id: String(item.id),
        name: item.alt || item.nom || "Produit",
        price: item.promotion
          ? Number(item.promotion)
          : Number(item.prix) || 0,
        quantity: Number(item.quantity) || 1,
        description: item.description,
        imageUrl: item.src
      }));

      // Appel à l'API checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items,
          userId: authUser.uid,
          userEmail: authUser.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement");
      }

      if (data.url) {
        // Redirection vers Stripe
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement non reçue");
      }
    } catch (error) {
      console.error("Erreur lors du checkout:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du paiement"
      );
      setIsLoading(false);
    }
  };

  /**
   * Calcule le total du panier
   */
  const calculateTotal = () =>
    cart.reduce(
      (acc, item) =>
        acc + (Number(item.prix) || 0) * (Number(item.quantity) || 0),
      0
    );

  /**
   * Gère le changement de quantité d'un produit
   */
  const handleQuantityChange = (id: string | number, value: number) => {
    if (value > 0) {
      updateCartItem(String(id), value);
    }
  };

  /**
   * Gère la suppression d'un produit du panier
   */
  const handleDelete = (id: string | number) => {
    removeCartItem(String(id));
  };

  return {
    cart,
    isLoading,
    calculateTotal,
    handleDelete,
    handleQuantityChange,
    handleStripeCheckout
  };
};
