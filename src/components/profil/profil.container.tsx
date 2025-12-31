/** @format */

import React from "react";
import PofilEement from "./profil.element";
import { firebaseLogOutUser } from "@/pages/api/authentification";
// Toast retiré - utilisation d'indicateurs visuels à la place
import { useRouter } from "next/router";

export default function ProfilContainer() {
  const route = useRouter();
  const handleDeconnexion = async() => {
    const {error} = await firebaseLogOutUser();
    if (error) {
      // L'erreur peut être gérée visuellement si nécessaire
      console.error("Erreur de déconnexion:", error);
      return;
    }
    // Déconnexion silencieuse avec redirection
    route.push("/shop");
  };
  return (
    <>
      <PofilEement action={handleDeconnexion} />
    </>
  );
}
