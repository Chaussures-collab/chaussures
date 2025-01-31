import React from "react";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { dbProduits } from "../home/produits/produitsDB";
import CartProduit from "../home/produits/cartProduit";

interface Props {
  categorie: string;
}

export default function ProduitCategorie({ categorie }: Props) {
  // Filtrer les produits par catégorie
  const produitsFiltres = dbProduits.filter(
    (produit) => produit.categorie === categorie
  );

  return (
    <div className="py-12 my-12 bg-white">
      <Typography component="h2" variant="h2" className="text-center">
        Nos produits de la catégorie : <span className="text-primary">{categorie}</span>
      </Typography>

      {produitsFiltres.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {produitsFiltres.map((produit, index) => (
            <CartProduit
              key={index}
              id={produit.id}
              src={produit.src}
              alt={produit.alt}
              nom={produit.nom}
              prix={produit.prix}
              promotion={produit.promotion ?? 0}
              description={produit.description}
            />
          ))}
        </div>
      ) : (
        <Typography
          component="p"
          variant="body"
          className="mt-8 text-center text-gray-600"
        >
          Aucun produit trouvé dans cette catégorie.
        </Typography>
      )}

      <div className="flex justify-center mt-8">
        <Button variant="outline" aria-label="Voir plus de produits">
          Voir plus
        </Button>
      </div>
    </div>
  );
}
