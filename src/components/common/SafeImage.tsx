/** @format */

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { normalizeImagePath } from "@/utils/imageUtils";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
}

/**
 * Composant Image sécurisé qui gère les erreurs de chargement
 * et désactive l'optimisation si nécessaire
 */
export default function SafeImage({ src, fallbackSrc, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(normalizeImagePath(src));
  const [hasError, setHasError] = useState(false);

  const normalizedSrc = normalizeImagePath(imgSrc);
  const isExternal = normalizedSrc.startsWith("http://") || normalizedSrc.startsWith("https://");

  // Désactiver l'optimisation pour les images externes ou si erreur
  // Pour les images locales avec extension WEBP, désactiver aussi l'optimisation
  const isWebP = normalizedSrc.toLowerCase().endsWith(".webp");
  const shouldUnoptimize = isExternal || hasError || isWebP;

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    } else if (!hasError) {
      setHasError(true);
      // Utiliser une image placeholder par défaut
      setImgSrc("/assets/images/placeholder.png");
    }
  };

  return (
    <Image
      {...props}
      src={normalizedSrc}
      alt={alt || "Image"}
      unoptimized={shouldUnoptimize}
      onError={handleError}
    />
  );
}

