/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const brands = [
  "Nike", "Adidas", "Puma", "Reebok", "New Balance", "Converse"
];

export default function MarqueContainer() {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-white to-primary/5 py-12">
      <Container>
        <div className="text-center mb-8">
          <Typography variant="h3" className="font-bold text-gray-900 mb-2">
            Toutes marques confondues
          </Typography>
          <Typography variant="body" className="text-gray-600">
            Découvrez une sélection variée de produits de qualité
          </Typography>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <FiCheckCircle className="text-primary" size={20} />
              <Typography variant="body" className="font-semibold text-gray-800">
                {brand}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
