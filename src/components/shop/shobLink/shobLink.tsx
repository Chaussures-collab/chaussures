/** @format */

import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import Container from "@/ui/components/container/container";
import Avatar from "@/ui/designSystem/avatar/avatar";
import Typography from "@/ui/designSystem/typography/typography";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

// Le composant ShobLink pour afficher une image et des breadcrumbs
export default function ShobLink() {
  const router = useRouter();
  const asPath = router.asPath;
  const segments = asPath.split("/");
  const currentPageName = segments[segments.length - 1].replace(/-/g, " "); // Remplacement des tirets par des espaces

  return (
    <Container className="relative h-[40vh] overflow-hidden p-0 m-0">
      {/* Image d'arrière-plan */}
      <Image
        src="/assets/images/Slide1.png"
        alt="Découvrir"
        layout="fill" // L'image prend toute la taille du conteneur
        objectPosition="center" // Centrage de l'image
        objectFit="cover" // L'image couvre le conteneur tout en maintenant ses proportions
        className="absolute inset-0"
      />

      {/* Overlay avec contenu centré */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        {/* Avatar */}
        <Avatar src="/assets/images/logo.png" alt="logo" size="small" />

        {/* Titre de la page */}
        <Typography
          variant="h4"
          className="p-0 m-0 leading-none text-center text-gray-800 capitalize"
        >
          {currentPageName}
        </Typography>

        {/* Breadcrumbs */}
        <Breadcrumbs className="flex justify-center w-full text-gray-800" />
      </div>
    </Container>
  );
}
