/** @format */

import Image from "next/image";
import React from "react";
import { normalizeImagePath } from "@/utils/imageUtils";

interface Props {
  src: string;
  alt: string;
}

export default function ListeImageProduit({ src, alt }: Props) {
  const normalizedSrc = normalizeImagePath(src);
  // Désactiver l'optimisation pour les fichiers WEBP (problème de casse)
  const isWebP = normalizedSrc.toLowerCase().endsWith(".webp");
  
  return (
    <div className="flex relative items-center w-full h-full">
      <Image
        src={normalizedSrc}
        alt={alt}
        layout="responsive"
        width={381}
        height={450}
        objectFit="cover"
        className="object-cover rounded"
        sizes="80px"
        unoptimized={isWebP}
      />
    </div>
  );
}
