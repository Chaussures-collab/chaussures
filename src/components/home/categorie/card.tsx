/** @format */

import Typography from "@/ui/designSystem/typography/typography";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
interface Props {
  src: string;
  alt: string;
  nom: string;
}

export default function Card({ src, alt, nom }: Props) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/shop?category=${encodeURIComponent(nom)}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex flex-col items-center justify-center overflow-hidden bg-white rounded-2xl w-full aspect-square hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {/* Conteneur pour l'image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Conteneur pour le texte */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
        <Typography
          variant="h4"
          component="h4"
          className="text-white font-bold drop-shadow-lg">
          {nom}
        </Typography>
      </div>
      
      {/* Badge hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
    </button>
  );
}
