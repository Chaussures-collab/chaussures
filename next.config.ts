/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "chaussures.vercel.app"], // Ajoute ton domaine Vercel ici
    // Désactiver l'optimisation pour les images locales si nécessaire
    unoptimized: false,
    // Formats d'images supportés
    formats: ["image/webp", "image/avif"],
    // Taille minimale pour l'optimisation
    minimumCacheTTL: 60,
  },
};

module.exports = nextConfig;
