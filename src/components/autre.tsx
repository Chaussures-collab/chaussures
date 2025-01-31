/** @format */
import Image from "next/image";
import React from "react";

interface ImageCardProps {
  src: string;
  alt: string;
}

const images = [
  { src: "/assets/images/Slide1.png", alt: "Image 1" },
  { src: "/assets/images/Slide2.jpg", alt: "Image 2" },/* 
  { src: "/assets/images/Slide3.png", alt: "Image 3" },
  { src: "/assets/images/Slide4.png", alt: "Image 4" }
  { src: "/assets/images/Slide1.png", alt: "Image 5" },
  { src: "/assets/images/Slide2.jpg", alt: "Image 6" },
  { src: "/assets/images/Slide3.png", alt: "Image 7" },
  { src: "/assets/images/Slide4.png", alt: "Image 8" } */
];
const imagesT = [
  { src: "/assets/images/Slide1.png", alt: "Image 1" },/*
  { src: "/assets/images/Slide2.jpg", alt: "Image 2" }, 
  { src: "/assets/images/Slide3.png", alt: "Image 3" },
  { src: "/assets/images/Slide4.png", alt: "Image 4" }
  { src: "/assets/images/Slide1.png", alt: "Image 5" },
  { src: "/assets/images/Slide2.jpg", alt: "Image 6" },
  { src: "/assets/images/Slide3.png", alt: "Image 7" },
  { src: "/assets/images/Slide4.png", alt: "Image 8" } */
];

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => (
<div className="relative w-full h-64 md:h-[400px] overflow-hidden rounded-lg">  
    <Image
      src={src}
      alt={alt}
      layout="fill"
      objectFit="cover"
      className="object-cover w-full h-full transition-transform duration-300 transform hover:scale-105"
    />
  </div>
);
const FunForFurnitureGrid: React.FC = () => {
  return (
    <div className="p-6 mx-auto ">
      <h1 className="mb-6 text-2xl font-bold text-center">Apperçu de nos produits</h1>
      {/* Conteneur principal */}
      <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-1 sm:gap-4">
        {images.map((image, index) => (
          <ImageCard key={index} src={image.src} alt={image.alt} />
        ))}
      </div>
      <div className="grid sm:grid-cols-1 my-2 sm:gap-4">
        {imagesT.map((image, index) => (
          <ImageCard key={index} src={image.src} alt={image.alt} />
        ))}
      </div>
    </div>
  );
};

export default FunForFurnitureGrid;
