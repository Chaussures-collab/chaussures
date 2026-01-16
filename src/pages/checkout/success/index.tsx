/** @format */

import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import { useEffect } from "react";
import { useCart } from "@/context/cartContext";

// app/checkout/success/page.tsx
export default function SuccessPage() {
  const cart = useCart();

  // Vider le panier après un paiement réussi
  useEffect(() => {
    if (cart?.cart && cart.cart.length > 0) {
      // Créer une copie pour vider le panier
      cart.cart.forEach((item) => {
        cart.removeCartItem(String(item.id));
      });
      console.log("✅ Panier vidé après paiement réussi");
    }
  }, []);

  return (
    <>
      <Seo
        title="Contact - SnipersMarket| Service Client et Assistance"
        description="Besoin d'aide ? Contactez SnipersMarketpour toute question sur vos commandes, paiements et livraisons. Notre service client est à votre écoute."
      />

      <Layout isDisplayCreadCrumbs={false}>
        <div className="text-center py-20 h-96">
          <h1>Paiement réussi 🎉</h1>
          <p>Votre commande est en cours de traitement.</p>
        </div>
      </Layout>
    </>
  );
}
