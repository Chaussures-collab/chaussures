import React, { useState, useEffect } from 'react';
import Container from '../container/container';
import Typography from '@/ui/designSystem/typography/typography';

export default function Navbar() {
  const [showSecondTypography, setShowSecondTypography] = useState(false);

  useEffect(() => {
    // Remplacer le texte après 5 secondes
    const timer = setTimeout(() => {
      setShowSecondTypography(true);
    }, 5000);

    // Nettoyage du timer lors du démontage du composant
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container className="flex justify-center h-8 my-auto text-white bg-primary">
      {/* Afficher le premier texte pendant 5 secondes */}
      {!showSecondTypography ? (
        <Typography variant="caption1" theme="white">
          Livraison gratuite pour nos produits
        </Typography>
      ) : (
        <Typography variant="caption1" theme="white">
          Produits de très bonne qualité
        </Typography>
      )}
    </Container>
  );
}
