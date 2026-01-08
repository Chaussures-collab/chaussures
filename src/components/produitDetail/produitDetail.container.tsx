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
  const allImages = [
    { id: 0, src: normalizeImagePath(produit.src), alt: produit.alt },
    ...(produit.images || []).map(img => ({
      ...img,
      src: normalizeImagePath(img.src)
    }))
  ];
  
  const currentImage = allImages[selectedImageIndex] || allImages[0];

  return (
    <>
      <Breadcrumbs nom={produit.nom} className="bg-primary-50 py-4" />

      <Container className="py-8">
        {/* Section principale : Image + Détails */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Colonne gauche : Galerie d'images */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Liste des images secondaires (desktop) */}
            <div className="hidden lg:flex flex-col gap-3 flex-shrink-0">
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
            <div className="relative w-full aspect-square flex-1 bg-gray-50 rounded-xl overflow-hidden shadow-lg flex items-center justify-center">
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                layout="responsive"
                width={381}
                height={450}
                objectFit="cover"
                className="rounded-lg shadow-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Miniatures (mobile) */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-4 px-4">
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
