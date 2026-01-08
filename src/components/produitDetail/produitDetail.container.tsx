import Container from "@/ui/components/container/container";
import ListeImageProduit from "./listeImageProduit";
import Image from "next/image";
import ProduitDetail from "./produitDetail";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import ProduitCategorie from "./produitCategorie";
import ProduitComment from "./produitComment";
import { ProduitType } from "@/types/produitType";
import { useState } from "react";
import { normalizeImagePath } from "@/utils/imageUtils";
import LimitedTimeDiscount from "@/components/promotions/LimitedTimeDiscount";
import StockNotification from "@/components/products/StockNotification";

type Props = {
  produit: ProduitType;
};

export default function ProduitDetailContainer({ produit }: Props) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Toutes les images : image principale + images secondaires
  // S'assurer que produit.images est un tableau et que chaque image a les bonnes propriétés
  const supplementaryImages = Array.isArray(produit.images) 
    ? produit.images.filter(img => img && img.src) // Filtrer les images invalides
    : [];
  
  const allImages = [
    { id: 0, src: normalizeImagePath(produit.src), alt: produit.alt },
    ...supplementaryImages.map((img, idx) => ({
      id: img.id || idx + 1,
      src: normalizeImagePath(img.src || ""),
      alt: img.alt || produit.alt || `Image ${idx + 1}`
    }))
  ];
  
  const currentImage = allImages[selectedImageIndex] || allImages[0];

  return (
    <>
      <Breadcrumbs nom={produit.nom} className="py-4 bg-primary-50" />

      <Container className="py-8">
        {/* Section principale : Image + Détails */}
        <div className="grid grid-cols-1 gap-8 mb-12 lg:grid-cols-2 lg:gap-12">
          {/* Colonne gauche : Galerie d'images */}
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Liste des images secondaires (desktop) */}
            <div className="hidden flex-col flex-shrink-0 gap-3 lg:flex">
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary shadow-md scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                  <ListeImageProduit src={image.src} alt={image.alt} />
                </button>
              ))}
            </div>

            {/* Image principale */}
            <div className="overflow-hidden relative flex-1 w-full bg-gray-50 rounded-xl shadow-lg aspect-square">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                unoptimized={currentImage.src.toLowerCase().endsWith(".webp")}
              />
            </div>

            {/* Miniatures (mobile) */}
            <div className="flex overflow-x-auto gap-2 px-4 pb-2 -mx-4 lg:hidden">
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === index
                      ? "border-primary shadow-md"
                      : "border-gray-200"
                  }`}>
                  <ListeImageProduit src={image.src} alt={image.alt} />
                </button>
              ))}
            </div>
          </div>

          {/* Colonne droite : Détails du produit */}
          <div className="flex flex-col justify-center space-y-4">
            {/* Réduction limitée si prixPromo existe */}
            {produit.prixPromo && produit.prix && (
              <LimitedTimeDiscount
                discountPercentage={Math.round(((produit.prix - produit.prixPromo) / produit.prix) * 100)}
                endDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} // 7 jours
              />
            )}
            
            {/* Notification stock si produit en rupture */}
            <StockNotification
              productId={produit.id}
              productName={produit.nom}
              currentStock={produit.quantiteStock || 0}
            />
            
            <ProduitDetail produit={produit} />
          </div>
        </div>

        {/* Section commentaires et produits similaires */}
        <div className="space-y-8">
          <ProduitComment src={produit.src} alt={produit.alt} />
          <hr className="border-gray-200" />
          <ProduitCategorie categorie={produit.categorie} />
        </div>
      </Container>
    </>
  );
}
