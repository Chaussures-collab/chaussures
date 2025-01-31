/** @format */

import React from "react";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import CartProduit from "./cartProduit";
import { dbProduits } from "./produitsDB";
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
  promotion?: string |number; // Optionnel
}

export default function Produits() {
  const router = useRouter(); // Remplacer useNavigate par useRouter
  const pageShop =() => {router.push('shop')};
  // Fonction pour afficher un nombre limité de produits
  const getLimitedProducts = (products: Produit[], limit: number = 8): Produit[] => {
    return products.slice(0, limit); // Retourne seulement les premiers "limit" produits
  };

  return (
    <Container className="py-6 my-6 bg-white">
      {/* Titre de la section */}
      <Typography component="h2" variant="h2" className="text-center mb-6">
        Nos Produits
      </Typography>

      {/* Grille des produits */}
      <div className="grid grid-cols-2 m:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {getLimitedProducts(dbProduits).map((produit) => (
          <CartProduit
            key={produit.id}
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
      <div className="flex justify-center mt-8">
        <Button variant="outline" action={pageShop}>Voir plus</Button>
      </div>
    </Container>
  );
}
