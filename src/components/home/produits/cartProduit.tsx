/** @format */

import React from "react";
import Image from "next/image";
import Typography from "@/ui/designSystem/typography/typography";
import { RiStarFill } from "react-icons/ri";
import Link from "next/link";

interface Produit {
  id: number;
  src: string;
  alt: string;
  nom: string;
  date?: string;
  description: string;
  prix: number;
  promotion: string | number;
}

export default function CartProduit({
  id,
  src,
  alt,
  nom,
  prix,
  promotion,
  date,
}: Produit) {

  // Vérifie si le produit a une promotion active
  const hasPromotion = promotion && Number(promotion) > 0;

  // Vérifie si le produit est récent (ajouté dans la semaine)
  const isNewProduct = React.useMemo(() => {
    if (!date) return false;

    const currentDate = new Date();
    const productDate = new Date(date);

    const differenceInDays =
      (currentDate.getTime() - productDate.getTime()) / (1000 * 3600 * 24);

    return differenceInDays <= 7;
  }, [date]);

  // Calcul du pourcentage de réduction
  const discountPercentage = React.useMemo(() => {
    if (!hasPromotion) return null;

    const prixReduit = Number(promotion);
    if (prix <= 0 || prixReduit <= 0 || prixReduit > prix) return null;

    return ((1 - prixReduit / prix) * 100).toFixed();
  }, [prix, promotion, hasPromotion]);

  return (
    <Link href={`/detail-produit/${id}`}>
    <div className="relative flex flex-col bg-gray-100 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Image et badges */}
      <div className="relative w-full md:h-48 h-32 sm:h-44 overflow-hidden rounded-t-lg">
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectFit="cover"
          className="hover:scale-105 transition-transform duration-500"
        />
        {/* Badge promotion */}
        {hasPromotion && discountPercentage && (
          <Typography
            component="span"
            variant="caption4"
            className="absolute flex flex-col items-center justify-center md:top-4 md:right-4 bg-white text-gray-900 rounded-full shadow-md md:w-[50px] md:h-[50px] w-[30px] h-[30px] top-1 right-1 bg-opacity-85"
          >
            -{discountPercentage}%
          </Typography>
        )}
        {/* Badge nouveauté */}
        {isNewProduct && (
          <Typography
            component="span"
            variant="caption4"
            className="absolute flex flex-col items-center justify-center top-1 left-1 md:top-4 md:left-4 bg-secondary bg-opacity-85 text-white rounded-full shadow-md md:p-5 w-[30px] h-[30px] md:w-[50px] md:h-[50px]"
          >
            New
          </Typography>
        )}
      </div>

      {/* Détails du produit */}
      <div className="flex flex-col px-2 md:p-4">
        <Typography variant="h5" component="h3" className="md:mb-2">
          {nom}
        </Typography>
        <Typography variant="caption1" className="text-gray-500 md:mb-4">
          <div className="flex space-x-2 text-yellow-500">
            <Typography
              variant="caption4"
              className="text-gray-4 flex items-center gap-1"
            >
              <RiStarFill className="text-yellow" />
              <RiStarFill className="text-yellow" />
              <RiStarFill className="text-yellow" />
              <RiStarFill className="text-yellow" />
              <RiStarFill className="text-yellow" />
            </Typography>
            <Typography variant="caption4" className="text-gray-4">
              | 4.5/5
            </Typography>
          </div>
        </Typography>

        {/* Prix et promotion */}
        <div className="flex items-center justify-between md:mb-4 space-x-4">
          <Typography variant="body" className="text-black font-bold">
            €{prix}
          </Typography>
          {hasPromotion && (
            <Typography variant="caption1" className="line-through text-gray-3">
              €{promotion}
            </Typography>
          )}
        </div>
      </div>
    </div>
    </Link>
  );
}
