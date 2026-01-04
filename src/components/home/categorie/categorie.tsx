/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";
import Card from "./card";
import { useCategories } from "@/hooks/useCategories";

export default function Categorie() {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="py-20 bg-white">
        <Container>
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white">
      <Container>
        <div className="mb-12 text-center">
          <div className="inline-block px-4 py-2 mb-4 rounded-full bg-primary/10">
            <Typography variant="caption1" className="font-semibold text-primary">
              Nos catégories
            </Typography>
          </div>
          <Typography
            variant="h2"
            component="h2"
            className="mb-4 font-bold text-gray-900">
            Parcourir la gamme
          </Typography>
          <Typography variant="body-lg" className="mx-auto max-w-2xl text-gray-600">
            Explorez notre large sélection de produits et découvrez des options
            adaptées à tous vos besoins. Parcourez notre gamme pour trouver des
            articles de qualité, soigneusement choisis pour vous.
          </Typography>
        </div>
        
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Card
              key={index}
              src={category.src}
              alt={category.alt}
              nom={category.nom}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
