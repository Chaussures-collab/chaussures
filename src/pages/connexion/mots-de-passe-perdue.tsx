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
      <Seo title="Mot de passe oublié" description="Shopimarket" />
      <Layout sessionStatus={GUEST} isDisplayCreadCrumbs={false}>
        <Breadcrumbs />
        <ForgetPasswordContainer />
        <QualiteContainer />
        <Paiement />
      </Layout>
    </>
  );
}
