/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "chaussures.vercel.app"], // Ajoute ton domaine Vercel ici
  },
};

module.exports = nextConfig;
