/** @format */

import React, { useState } from "react";
import Container from "@/ui/components/container/container";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import Collection from "./collection";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Button from "@/ui/designSystem/button/button";

export default function Decouvrir() {
  const { products, isLoading } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Utiliser les 5 premiers produits pour le slider
  const sliderProducts = products.slice(0, 5);

  const handleNext = () => {
    if (sliderProducts.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderProducts.length);
    }
  };

  const handlePrev = () => {
    if (sliderProducts.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? sliderProducts.length - 1 : prevIndex - 1
      );
    }
  };

  if (isLoading || sliderProducts.length === 0) {
    return (
      <Container className="relative w-full overflow-hidden">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="relative w-full overflow-hidden">
      {/* Le conteneur principal avec le carrousel */}
      <div
        className="relative flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)` // Appliquer le décalage horizontal sur le conteneur principal
        }}
      >
        {sliderProducts.map((produit, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-full h-full mx-5"
          >
            {/* Image */}
            <Image
              src={produit.src}
              alt={produit.alt}
              layout="fill"
              objectFit="cover"
              className="absolute"
            />
            {/* Collection */}
            <Collection className="absolute p-5 bg-white bg-opacity-50 rounded-lg shadow-lg sm:bottom-5 sm:right-10 md:bottom-10" />

            <Button
              action={handleNext}
              variant="ico"
              size="medium"
              iconTheme="secondary"
              icon={{ icon: FaArrowRight }}
              className="absolute transform -translate-y-1/2 bg-opacity-50 rounded-full shadow shadow-gray-3 right-5 top-1/2"
            />
            <Button
              action={handlePrev}
              variant="ico"
              size="medium"
              iconTheme="secondary"
              icon={{ icon: FaArrowLeft }}
              className="absolute transform -translate-y-1/2 bg-opacity-50 rounded-full shadow-md left-5 top-1/2"
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
