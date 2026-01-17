/** @format */

import { useRouter } from "next/router";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import ProduitDetailContainer from "@/components/produitDetail/produitDetail.container";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import Paiement from "@/components/shop/paiement/paiement";
import { useProductById } from "@/hooks/useProductById";

export default function DetailProduit() {
  const router = useRouter();
  const { id } = router.query;

  const productId = typeof id === "string" ? id : undefined;
  const { product: produit, isLoading, error } = useProductById(productId);

  if (router.isFallback || isLoading) {
    return <Layout isDisplayCreadCrumbs={false}>Chargement…</Layout>;
  }

  if (error || !produit) {
    return (
      <Layout isDisplayCreadCrumbs={false}>
        <p>Produit introuvable</p>
      </Layout>
    );
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://snipersmarket.com";

  const productImage = produit.src.startsWith("http")
    ? produit.src
    : `${siteUrl}${produit.src}`;

  const productUrl = `${siteUrl}/detail-produit/${produit.id}`;

  return (
    <>
      <Seo
        title={`${produit.nom} - SnipersMarket`}
        description={produit.description || produit.description1}
        image={productImage}
        url={productUrl}
        type="product"
        price={produit.prixPromo || produit.prix}
        availability={
          produit.quantiteStock && produit.quantiteStock > 0
            ? "in stock"
            : "out of stock"
        }
        category={produit.categorie}
      />
      <Layout isDisplayCreadCrumbs={false}>
        <ProduitDetailContainer produit={produit} />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
