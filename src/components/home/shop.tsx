/** @format */

import Container from "@/ui/components/container/container";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { useRouter } from "next/router";

export default function Decouvrir() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false); // État pour détecter si le composant est chargé

  // Navigation vers la boutique
  const pageShop = () => {
    router.push("/shop");
  };

  const [count, setCount] = useState(0); // Initialise l'état à 0
  const target = 200; // Valeur cible

  useEffect(() => {
    const incrementDuration = 8000; // 30 secondes
    const incrementSpeed = incrementDuration / target; // Temps pour atteindre chaque incrément (en millisecondes)

    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount < target) {
          return prevCount + 1;
        } else {
          clearInterval(interval); // Arrêter l'incrémentation une fois la cible atteinte
          return target;
        }
      });
    }, incrementSpeed);

    // Déclencher l'animation de chargement après 100ms
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100); // Délai pour commencer l'animation

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`text-center hidden m:flex ${isLoaded ? 'opacity-100 transform transition-all duration-1000' : 'opacity-0 transform translate-y-10'}`}>
      {/* Section Desktop */}
      <Container className="flex flex-wrap sm:flex-nowrap overflow-visible">
        <div className="flex-1 space-y-2 sm:space-y-6 relative p-2 lg:p-10">
          {/* Titre principal */}
          <Typography variant="h4" className="text-gray-900 font-bold">
            TROUVEZ VOTRE PRODUIT FAVORI EN FONCTION
          </Typography>

          {/* Description */}
          <Typography variant="body" className="text-gray-600 text-justify">
            Découvrez notre vaste collection de produits soigneusement conçus,
            pensés pour révéler votre individualité et répondre à votre sens du
            style.
          </Typography>
          <div className="hidden sm:flex">
            {/* Bouton Boutique */}
            <Button
              variant="accent"
              size="medium"
              className="mt-4 rounded-full transition-transform transform hover:scale-105"
              action={pageShop}
            >
              Visitez la boutique
            </Button>
          </div>
          <div className="sm:hidden">
            {/* Bouton Boutique */}
            <Button
              variant="accent"
              size="medium"
              className="mt-4 rounded-full w-full transition-transform transform hover:scale-105"
              action={pageShop}
            >
              Visitez la boutique
            </Button>
          </div>

          {/* Statistiques */}
          <div className="flex flex-row justify-center items-center gap-6 md:mt-8">
            <div className="text-center m-0 p-0">
              <Typography variant="h3" className="text-gray-900 font-bold">
                {count}+
              </Typography>
              <Typography
                variant="caption3"
                theme="gray"
                className="text-gray-500"
              >
                Marques internationales
              </Typography>
            </div>
            <div className="h-20 w-[2px] bg-gray-3 mx-auto"></div>
            <div className="text-center">
              <Typography variant="h3" className="text-gray-900 font-bold">
                2,000+
              </Typography>
              <Typography
                variant="caption3"
                theme="gray"
                className="text-gray-500"
              >
                Produits de haute qualité
              </Typography>
            </div>
            <div className="h-20 w-[2px] bg-gray-3 mx-auto hidden m:flex"></div>

            <div className="text-center hidden m:flex">
              <Typography variant="h3" className="text-gray-900 font-bold">
                {count}+
              </Typography>
              <Typography
                variant="caption3"
                theme="gray"
                className="text-gray-500"
              >
                Clients satisfaits
              </Typography>
            </div>
          </div>
          <div className="justify-center flex-1 m:hidden mt-2">
            <div className="text-center  ">
              <Typography variant="h3" className="text-gray-900 font-bold">
                {count}+
              </Typography>
              <Typography
                variant="caption3"
                theme="gray"
                className="text-gray-500"
              >
                Clients satisfaits
              </Typography>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full sm:w-1/2 sm:mt-6 sm:mt-0 overflow-hidden">
          <div className="relative w-full h-96 sm:h-full">
            <Image
              src="/assets/images/accueils.jpg"
              alt="Decouvrir"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="rounded-lg shadow-md transition-transform transform hover:scale-105"
            />
          </div>
        </div>
      </Container>

      {/* Section Mobile */}
      {/* <Container className="relative h-[70vh] lg:hidden overflow-visible">
        <Image
          src="/assets/images/Slide1.png"
          alt="Decouvrir"
          layout="fill"
          objectPosition="center"
          objectFit="cover"
          className="absolute top-[-10%] left-[-10%] rounded-lg shadow-lg"
        />
        <Collection className="absolute p-5 bg-white bg-opacity-80 rounded-lg shadow-lg bottom-10 right-10" />
      </Container> */}
    </div>
  );
}
