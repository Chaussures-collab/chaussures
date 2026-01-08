/** @format */

import { useEffect, useCallback } from "react";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/AuthUserContext";
import { AbandonedCartService, AbandonedCartItem } from "@/services/cart/AbandonedCartService";

const CART_ABANDONMENT_DELAY = 30 * 60 * 1000; // 30 minutes en millisecondes

export function useAbandonedCart() {
  const { cart } = useCart();
  const { authUser } = useAuth();
  const abandonedCartService = new AbandonedCartService();

  /**
   * Sauvegarde le panier actuel comme panier abandonné
   */
  const saveAbandonedCart = useCallback(async () => {
    if (cart.length === 0 || !authUser) {
      return;
    }

    try {
      const items: AbandonedCartItem[] = cart.map((item) => ({
        id: item.id,
        nom: item.nom || item.alt,
        alt: item.alt,
        src: item.src,
        prix: item.prix,
        promotion: item.promotion ?? null,
        quantity: Number(item.quantity) || 1,
        selectedSize:
          item.selectedSize !== undefined
            ? String(item.selectedSize)
            : undefined,
        selectedColor: item.selectedColor
      }));

      const total = cart.reduce(
        (sum, item) =>
          sum +
          (item.promotion ? Number(item.promotion) : Number(item.prix) || 0) *
            (Number(item.quantity) || 1),
        0
      );

      await abandonedCartService.saveAbandonedCart({
        userId: authUser.uid,
        userEmail: authUser.email || undefined,
        items,
        total
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier abandonné:", error);
    }
  }, [cart, authUser, abandonedCartService]);

  /**
   * Sauvegarde automatique du panier après un délai d'inactivité
   */
  useEffect(() => {
    if (cart.length === 0 || !authUser) {
      return;
    }

    // Sauvegarder dans localStorage pour persister entre les sessions
    const cartData = {
      items: cart,
      timestamp: Date.now(),
      userId: authUser.uid
    };
    localStorage.setItem("abandonedCart", JSON.stringify(cartData));

    // Timer pour sauvegarder dans Firestore après le délai
    const timer = setTimeout(() => {
      saveAbandonedCart();
    }, CART_ABANDONMENT_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [cart, authUser, saveAbandonedCart]);

  /**
   * Récupère les paniers abandonnés de l'utilisateur
   */
  const getUserAbandonedCarts = useCallback(async () => {
    if (!authUser) {
      return [];
    }

    try {
      return await abandonedCartService.getUserAbandonedCarts(authUser.uid);
    } catch (error) {
      console.error("Erreur lors de la récupération des paniers abandonnés:", error);
      return [];
    }
  }, [authUser, abandonedCartService]);

  /**
   * Marque un panier comme récupéré
   */
  const markAsRecovered = useCallback(
    async (cartId: string) => {
      try {
        await abandonedCartService.markAsRecovered(cartId);
        // Supprimer du localStorage aussi
        localStorage.removeItem("abandonedCart");
      } catch (error) {
        console.error("Erreur lors du marquage du panier comme récupéré:", error);
      }
    },
    [abandonedCartService]
  );

  return {
    saveAbandonedCart,
    getUserAbandonedCarts,
    markAsRecovered
  };
}

