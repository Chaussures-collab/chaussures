/** @format */

import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";

// app/checkout/success/page.tsx
export default function SuccessPage() {
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
