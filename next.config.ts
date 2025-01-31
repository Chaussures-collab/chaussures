/** @format */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true
};
// next.config.js
module.exports = {
  images: {
    domains: ["localhost"] // permet de charger des images locales
  }
};

export default nextConfig;
