import Container from "@/ui/components/container/container";
import ListeImageProduit from "./listeImageProduit";
import Image from "next/image";
import ProduitDetail from "./produitDetail";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import ProduitCategorie from "./produitCategorie";
import ProduitComment from "./produitComment";
import { ProduitType } from "@/types/produitType";

type Props = {
  produit: ProduitType;
};

export default function ProduitDetailContainer({ produit }: Props) {
  return (
    <>
      <Breadcrumbs nom={produit.nom} className="bg-primary-1 py-auto" />

      <Container>
        <div className="flex flex-col md:flex-row justify-center gap-8 my-2 lg:grid-cols-3">
          <div className="flex flex-col custom:flex-row space-x-1 justify-center">
            {/* Liste des images secondaires */}
            <div className="hidden custom:flex flex-col gap-1 min-w-sm:flex-row sm:gap-2">
              {produit.images &&
                produit.images.map((image) => (
                  <ListeImageProduit
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                  />
                ))}
            </div>

            {/* Image principale */}
            <div className="relative w-auto ">
              <Image
                src={produit.src}
                alt={produit.alt}
                layout="responsive"
                width={481}
                height={500}
                objectFit="cover"
                className="shadow-lg min-w-[233px] min-h-[250px] rounded-lg max-w-[600px] max-h-[700px] md:max-w-[600px] md:max-h-[700px] md:min-w-[433px] md:min-h-[500px] rounded mx-auto"
              />
            </div>
            <div className="flex flex-row my-4 justify-center gap-2 custom:hidden max-h-12 ">
              {produit.images &&
                produit.images.map((image) => (
                  <ListeImageProduit
                    key={image.id}
                    src={image.src}
                    alt={image.alt}
                  />
                ))}
            </div>
          </div>

          {/* Détails du produit */}
          <ProduitDetail
            produit={produit}
          />
        </div>
        <ProduitComment />
        <hr className="my-2 border-gray-4" />
        <ProduitCategorie categorie={produit.categorie} />
      </Container>
    </>
  );
}
