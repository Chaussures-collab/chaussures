/** @format */

import React from "react";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import CartProduit from "./cartProduit";
import { useProducts } from "@/hooks/useProducts";
import Button from "@/ui/designSystem/button/button";
import { useRouter } from "next/router";

// Définition de l'interface Produit
interface Produit {
  id: number; // ou string
  src: string;
  alt: string;
  prix: number;
  nom: string;
  description: string;
  dateAjout: string; // ou Date
  promotion?: string | number | null;
}

export default function Produits() {
  const router = useRouter(); // Remplacer useNavigate par useRouter
  const pageShop =() => {router.push('/shop')};
  const { products, isLoading } = useProducts();
  
  // Fonction pour afficher un nombre limité de produits
  const getLimitedProducts = (products: Produit[], limit: number = 30): Produit[] => {
    return products.slice(0, limit); // Retourne seulement les premiers "limit" produits
  };

  if (isLoading) {
    return (
      <div className="bg-white py-16">
        <Container>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white py-16">
      <Container>
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <Typography
            component="h4"
            variant="h4"
            className="font-bold text-gray-900 mb-4">
            Nos Produits Populaires
          </Typography>
          <Typography
            variant="body"
            className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de produits les plus appréciés par nos
            clients
          </Typography>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
          {getLimitedProducts(products, 10).map((produit, index) => (
            <CartProduit
              key={index}
              id={produit.id}
              src={produit.src}
              alt={produit.alt}
              prix={produit.prix}
              nom={produit.nom}
              description={produit.description}
              date={produit.dateAjout}
              promotion={produit.promotion ?? ""}
            />
          ))}
        </div>

        {/* Bouton "Voir plus" */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            action={pageShop}
            className="px-8 py-3 rounded-lg font-semibold">
            Voir tous les produits
          </Button>
        </div>
      </Container>
    </div>
  );
}
