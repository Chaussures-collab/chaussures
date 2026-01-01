/** @format */
import Image from "next/image";
import React, { useState } from "react";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";

interface ImageCardProps {
  src: string;
  alt: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const images = [
  { src: "/assets/images/Slide1.png", alt: "Image 1" },
  { src: "/assets/images/Slide2.jpg", alt: "Image 2" }
];

const imagesT = [
  { src: "/assets/images/Slide1.png", alt: "Image 1" }
];

const ImageCard: React.FC<ImageCardProps> = ({ src, alt, onClick, isSelected }) => (
  <div
    onClick={onClick}
    className={`relative w-full h-64 md:h-[400px] overflow-hidden rounded-lg cursor-pointer ${
      isSelected ? "ring-2 ring-primary" : ""
    }`}>
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 50vw, 33vw"
    />
  </div>
);

const FunForFurnitureGrid: React.FC = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const allImages = [...images, ...imagesT];
  const currentImage = selectedImageIndex !== null ? allImages[selectedImageIndex] : null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-20">
      <Container>
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Typography variant="caption1" className="text-primary font-semibold">
              Galerie produits
            </Typography>
          </div>
          <Typography variant="h2" className="font-bold text-gray-900 mb-4">
            Aperçu de nos produits
          </Typography>
          <Typography variant="body-lg" className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits de qualité dans un environnement visuel moderne
          </Typography>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
          {images.map((image, index) => (
            <ImageCard
              key={index}
              src={image.src}
              alt={image.alt}
              onClick={() => setSelectedImageIndex(index)}
              isSelected={selectedImageIndex === index}
            />
          ))}
        </div>

        {/* Image large en bas */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {imagesT.map((image, index) => {
            const actualIndex = images.length + index;
            return (
              <ImageCard
                key={actualIndex}
                src={image.src}
                alt={image.alt}
                onClick={() => setSelectedImageIndex(actualIndex)}
                isSelected={selectedImageIndex === actualIndex}
              />
            );
          })}
        </div>

        {/* Modal pour image sélectionnée */}
        {currentImage && selectedImageIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}>
            <div
              className="relative max-w-6xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition">
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default FunForFurnitureGrid;
