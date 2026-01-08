/** @format */

import React from "react";
import Head from "next/head";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "product" | "article";
  price?: number;
  currency?: string;
  availability?: "in stock" | "out of stock" | "preorder";
  category?: string;
  brand?: string;
  jsonLd?: object;
}

const defaultTitle = "SnipersMarket - Votre plateforme e-commerce";
const defaultDescription = "Découvrez une large gamme de produits de qualité sur SnipersMarket. Livraison rapide, paiement sécurisé et promotions exclusives !";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://snipersmarket.com";

export default function Seo({
  title = defaultTitle,
  description = defaultDescription,
  image,
  url,
  type = "website",
  price,
  currency = "EUR",
  availability,
  category,
  brand = "SnipersMarket",
  jsonLd
}: SeoProps) {
  const fullTitle = title.includes("SnipersMarket") ? title : `${title} | SnipersMarket`;
  const ogImage = image || `${siteUrl}/assets/images/logo.png`;
  const pageUrl = url || siteUrl;

  // JSON-LD pour les produits
  const productJsonLd = price
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: title,
        description: description,
        image: ogImage,
        brand: {
          "@type": "Brand",
          name: brand
        },
        offers: {
          "@type": "Offer",
          price: price,
          priceCurrency: currency,
          availability: availability
            ? `https://schema.org/${availability === "in stock" ? "InStock" : availability === "out of stock" ? "OutOfStock" : "PreOrder"}`
            : "https://schema.org/InStock",
          url: pageUrl
        },
        ...(category && { category: category })
      }
    : null;

  // JSON-LD pour les organisations
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SnipersMarket",
    url: siteUrl,
    logo: `${siteUrl}/assets/images/logo.png`,
    description: defaultDescription
  };

  return (
    <>
      <Head>
        {/* Meta tags de base */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/images/logo.png" sizes="32x32" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="SnipersMarket" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Meta tags supplémentaires */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="SnipersMarket" />
        {category && <meta name="keywords" content={`${category}, produits, e-commerce, SnipersMarket`} />}

        {/* JSON-LD */}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        {productJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </Head>
    </>
  );
}
