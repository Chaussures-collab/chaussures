/** @format */

import Typography from "@/ui/designSystem/typography/typography";
import Image from "next/image";
import React from "react";
interface Props {
  src: string;
  alt: string;
  nom: string;
}

export default function Card({ src, alt, nom }: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden bg-gray-200 rounded-lg w-80 h-80">
      {/* Conteneur pour l'image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={300} // Valeur à adapter
          height={200} // Valeur à adapter
          objectFit="cover"
          className="hover:scale-105 transition-transform duration-500 rounded"
        />
      </div>

      {/* Conteneur pour le texte */}
      <div className="absolute mt-4">
        <Typography variant="h4" component="h4" weight="regular">
          {nom}
        </Typography>
      </div>
    </div>
  );
}
