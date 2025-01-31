/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";
import Card from "./card";
import { dbCategories } from "./categorieDB";

export default function Categorie() {
  return (
    <Container className="mt-16">
      <Typography
        variant="h2"
        component="h2"
        className="text-center"
      >
        Parcourir la gamme
      </Typography>
      <Typography variant="caption1" className="text-center">
        Explorez notre large sélection de produits et découvrez des options
        adaptées à tous vos besoins. Parcourez notre gamme pour trouver des
        articles de qualité, soigneusement choisis pour vous.
      </Typography>
      {/* Categorie Grid */}
      {/* <div className="flex flex-wrap justify-center gap-4 mt-10">
        <Card />
      </div> */}
      <div className="flex flex-wrap justify-center gap-4 mx-auto ">
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
  );
}
