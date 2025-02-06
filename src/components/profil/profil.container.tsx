/** @format */

import React from "react";
import PofilEement from "./profil.element";
import { firebaseLogOutUser } from "@/pages/api/authentification";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function ProfilContainer() {
  const route = useRouter();
  const handleDeconnexion = async() => {
    const {error} = await firebaseLogOutUser();
    if (error) {
         toast.error(error.message);
    }
    toast.success("Vous êtes déconnecté avec succès");
    route.push("/shop");
  };
  return (
    <>
      <PofilEement action={handleDeconnexion} />
    </>
  );
}
