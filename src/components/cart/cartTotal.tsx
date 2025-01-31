/** @format */

import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import { useRouter } from "next/router";
import React from "react";

export default function CartTotal({ totalAmount = 2500 }) {
  const route = useRouter();
  const handleCaissement = () => route.push("/checkout");
  return (
    <div className="w-full max-w-sm p-6 mx-auto  text-center shadow bg-primary-1">
      {/* Titre */}
      <Typography
        variant="h4"
        component="h4"
        className="mb-4 text-center text-primary"
      >
        Totaux des paniers
      </Typography>

      {/* Ligne de total */}
      <div className="flex items-center justify-between w-full mb-6 px-9">
        <Typography variant="body" component="span" className="text-gray-700">
          Total
        </Typography>
        <Typography
          variant="body"
          theme="primary"
          component="span"
          className="font-bold text-gray-900"
        >
          € {totalAmount.toLocaleString()}
        </Typography>
      </div>
      {/* Ligne de total */}
      <div className="flex items-center justify-between w-full mb-6 px-9">
        <Typography variant="body" component="span" className="text-gray-700">
          Total
        </Typography>
        <Typography
          variant="body"
          theme="primary"
          component="span"
          className="font-bold text-gray-900"
        >
          € {totalAmount.toLocaleString()}
        </Typography>
      </div>

      {/* Bouton pour passer à la caisse */}
      <Button
        variant="outline"
        action={handleCaissement}
        size="small"
        className="rounded"
        aria-label="Passer à la caisse"
      >
        Caisse
      </Button>
    </div>
  );
}
