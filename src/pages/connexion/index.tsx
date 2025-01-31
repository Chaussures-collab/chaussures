/** @format */

import Seo from "@/ui/components/seo/seo";

import Layout from "@/ui/components/layout/layout";
import LoginContainer from "@/ui/modules/authentication/login/login.container";
import Breadcrumbs from "@/ui/components/breadcrumbs/breadcrumbs";
import { GUEST } from "@/lib/session-status";

export default function Connexion() {
  return (
    <>
      <Seo title="Connexion " description="Site vitrine" />
      <Layout sessionStatus={GUEST} isDisplayCreadCrumbs={false}>
        <Breadcrumbs />
        <LoginContainer />
      </Layout>
    </>
  );
}
