/** @format */

import Seo from "@/ui/components/seo/seo";

import Layout from "@/ui/components/layout/layout";
import ForgetPasswordContainer from "@/ui/modules/authentication/forfet-password/forget-password.container";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import { GUEST } from "@/lib/session-status";
import QualiteContainer from "@/components/shop/qualite/qualite.container";
import Paiement from "@/components/shop/paiement/paiement";

export default function MotsDePassePerdue() {
  return (
    <>
      <Seo
        title="Mot de passe oublié ? Réinitialisez-le rapidement | ShopiMarket"
        description="Mot de passe oublié ? Suivez les étapes simples pour réinitialiser votre mot de passe et retrouver l'accès à votre compte ShopiMarket en toute sécurité."
      />
      <Layout sessionStatus={GUEST} isDisplayCreadCrumbs={false}>
        <Breadcrumbs />
        <ForgetPasswordContainer />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
