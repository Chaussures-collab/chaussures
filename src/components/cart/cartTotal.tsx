/** @format */

import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import { useRouter } from "next/router";
import React from "react";
import { FiShoppingCart, FiTruck } from "react-icons/fi";

export default function CartTotal({ totalAmount = 0 }) {
  const route = useRouter();
  const handleCaissement = () => route.push("/checkout");

  const subtotal = totalAmount;
  const shipping = 0; // Livraison gratuite
  const total = subtotal + shipping;

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Titre */}
      <Typography
        variant="h4"
        component="h4"
        className="mb-6 text-center font-bold text-gray-900">
        Récapitulatif
      </Typography>

      {/* Détails */}
      <div className="space-y-4 mb-6">
        {/* Sous-total */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <Typography variant="body" component="span" className="text-gray-700">
            Sous-total
          </Typography>
          <Typography
            variant="body"
            component="span"
            className="font-semibold text-gray-900">
            € {subtotal.toFixed(2)}
          </Typography>
        </div>

        {/* Livraison */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FiTruck className="text-gray-600" size={18} />
            <Typography variant="body" component="span" className="text-gray-700">
              Livraison
            </Typography>
          </div>
          <Typography
            variant="body"
            component="span"
            className="font-semibold text-green-600">
            Gratuite
          </Typography>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
          <Typography
            variant="h4"
            component="span"
            className="font-bold text-gray-900">
            Total
          </Typography>
          <Typography
            variant="h4"
            component="span"
            className="font-bold text-primary">
            € {total.toFixed(2)}
          </Typography>
        </div>
      </div>

      {/* Bouton pour passer à la caisse */}
      <Button
        variant="suivant"
        action={handleCaissement}
        size="medium"
        className="w-full rounded-lg py-3 flex items-center justify-center gap-2"
        aria-label="Passer à la caisse">
        <FiShoppingCart size={20} />
        Passer à la caisse
      </Button>

      {/* Info supplémentaire */}
      <p className="text-xs text-center text-gray-500 mt-4">
        Les taxes sont incluses dans le prix
      </p>
    </div>
  );
}
