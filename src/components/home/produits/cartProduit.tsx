/** @format */

import React from "react";
import Typography from "@/ui/designSystem/typography/typography";
import { RiStarFill } from "react-icons/ri";
import Link from "next/link";
import SafeImage from "@/components/common/SafeImage";

interface Produit {
  id: string;
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
  date
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
    <Link href={`/detail-produit/${id}`} className="block h-full group">
      <div className="flex overflow-hidden relative flex-col h-full bg-white rounded-xl border border-gray-100 shadow-md transition-all duration-300 hover:shadow-2xl hover:border-primary/20 item-center">
        {/* Image et badges */}
        <div className="overflow-hidden relative w-full bg-gray-50 aspect-square flex items-center">
          <SafeImage
            src={src}
            alt={alt}
            layout="responsive"
            width={381}
            height={450}
            objectFit="cover"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />

          {/* Overlay au survol */}
          <div className="absolute inset-0 transition-all duration-300 bg-black/0 group-hover:bg-black/5" />

          {/* Badge promotion */}
          {hasPromotion && discountPercentage && (
            <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full shadow-lg px-3 py-1.5 text-xs font-bold animate-pulse">
              -{discountPercentage}%
            </div>
          )}

          {/* Badge nouveauté */}
          {isNewProduct && (
            <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full shadow-lg px-3 py-1.5 text-xs font-bold">
              Nouveau
            </div>
          )}

          {/* Bouton rapide au survol */}
          <div className="flex absolute inset-0 justify-center items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="px-4 py-2 text-sm font-semibold rounded-lg shadow-lg backdrop-blur-sm transition-transform transform translate-y-2 bg-white/95 text-primary group-hover:translate-y-0">
              Voir les détails
            </div>
          </div>
        </div>

        {/* Détails du produit */}
        <div className="flex flex-col flex-grow p-4">
          <Typography
            variant="h5"
            component="h2"
            className="mb-2 font-semibold text-gray-900 transition-colors line-clamp-2 group-hover:text-primary">
            {nom}
          </Typography>

          {/* Note et avis */}
          <div className="flex gap-2 items-center mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <RiStarFill key={i} className="text-yellow-400" size={14} />
              ))}
            </div>
            <Typography variant="caption4" className="text-gray-500">
              4.5 (128 avis)
            </Typography>
          </div>

          {/* Prix et promotion */}
          <div className="flex gap-2 items-center mt-auto">
            <Typography
              variant="body"
              className={`font-bold ${
                hasPromotion ? "text-primary" : "text-gray-900"
              } text-lg`}>
              € {promotion ? Number(promotion).toFixed(2) : prix.toFixed(2)}
            </Typography>
            {hasPromotion && (
              <Typography
                variant="caption1"
                className="text-gray-400 line-through">
                € {prix.toFixed(2)}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
