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
    <div
      className={`relative overflow-hidden ${
        isLoaded
          ? "opacity-100 transform transition-all duration-1000"
          : "opacity-0 transform translate-y-10"
      }`}>
      {/* Section Hero avec gradient */}
      <div className="relative bg-gradient-to-br from-primary/10 via-white to-primary/5">
        <Container className="py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Contenu texte */}
            <div className="space-y-6 lg:space-y-8">
              {/* Badge */}
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                <Typography variant="caption1" className="text-primary font-semibold">
                  ✨ Nouvelle collection disponible
                </Typography>
              </div>

              {/* Titre principal */}
              <Typography
                variant="h1"
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Trouvez votre produit favori en fonction de vos besoins
              </Typography>

              {/* Description */}
              <Typography variant="body-lg" className="text-gray-600 max-w-xl">
                Découvrez notre vaste collection de produits soigneusement conçus,
                pensés pour révéler votre individualité et répondre à votre sens du
                style. Qualité garantie, livraison rapide.
              </Typography>

              {/* Boutons CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="accent"
                  size="large"
                  className="rounded-lg px-8 py-4 font-semibold transition-transform transform hover:scale-105"
                  action={pageShop}>
                  Découvrir la boutique
                </Button>
                <Button
                  variant="outline"
                  size="large"
                  className="rounded-lg px-8 py-4 font-semibold"
                  action={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                  Voir les produits
                </Button>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <Typography variant="h3" className="text-primary font-bold mb-1">
                    {count}+
                  </Typography>
                  <Typography variant="caption1" className="text-gray-600">
                    Marques
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="h3" className="text-primary font-bold mb-1">
                    {count}+
                  </Typography>
                  <Typography variant="caption1" className="text-gray-600">
                    Produits
                  </Typography>
                </div>
                <div className="text-center">
                  <Typography variant="h3" className="text-primary font-bold mb-1">
                    {count}+
                  </Typography>
                  <Typography variant="caption1" className="text-gray-600">
                    Clients
                  </Typography>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full lg:w-auto">
              <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/assets/images/accueils.jpg"
                  alt="Découvrez nos produits"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Overlay décoratif */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
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
    </div>
  );
}
