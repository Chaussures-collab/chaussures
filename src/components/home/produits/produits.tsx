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
  id: string; // ou string
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
  const pageShop = () => {
    router.push("/shop");
  };
  const { products, isLoading } = useProducts();

  // Sélectionner des produits mis en avant de catégories différentes
  const featuredProducts: Produit[] = React.useMemo(() => {
    const byCategory = new Map<string, Produit[]>();

    products.forEach((p) => {
      const cat = p.categorie || "Autres";
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(p);
    });

    const result: Produit[] = [];
    byCategory.forEach((list) => {
      // Mélanger un peu chaque liste
      const copy = [...list];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      if (copy[0]) result.push(copy[0]);
    });

    // Limiter à 10 produits max
    return result.slice(0, 40);
  }, [products]);

  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <Container>
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <Container>
        {/* En-tête de section */}
        <div className="mb-12 text-center">
          <Typography
            component="h4"
            variant="h4"
            className="mb-4 font-bold text-gray-900">
            Nos Produits Populaires
          </Typography>
          <Typography
            variant="body"
            className="mx-auto max-w-2xl text-gray-600">
            Découvrez notre sélection de produits les plus appréciés par nos
            clients
          </Typography>
        </div>

        {/* Grille des produits (catégories variées) */}
        <div className="grid grid-cols-2 gap-4 mb-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-6">
          {featuredProducts.map((produit) => (
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
        <div className="flex justify-center">
          <Button
            variant="outline"
            action={pageShop}
            className="px-8 py-3 font-semibold rounded-lg">
            Voir tous les produits
          </Button>
        </div>
      </Container>
    </div>
  );
}
