/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";
import Card from "./card";
import { dbCategories } from "./categorieDB";

export default function Categorie() {
  return (
    <div className="bg-white py-20">
      <Container>
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Typography variant="caption1" className="text-primary font-semibold">
              Nos catégories
            </Typography>
          </div>
          <Typography
            variant="h2"
            component="h2"
            className="font-bold text-gray-900 mb-4">
            Parcourir la gamme
          </Typography>
          <Typography variant="body-lg" className="text-gray-600 max-w-2xl mx-auto">
            Explorez notre large sélection de produits et découvrez des options
            adaptées à tous vos besoins. Parcourez notre gamme pour trouver des
            articles de qualité, soigneusement choisis pour vous.
          </Typography>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dbCategories.map((category, index) => (
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
