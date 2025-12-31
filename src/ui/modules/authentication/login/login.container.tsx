/** @format */

import React, { useState } from "react";
import LoginView from "./login.view";
import { LoginFormFieldsType } from "@/types/forms";
import { SubmitHandler, useForm } from "react-hook-form";
// Toast retiré - utilisation de FormError à la place
import { firebaseLoginUser } from "@/pages/api/authentification";
import { useRouter } from "next/router";
/* interface Props {
  form: FormsType<LoginFormFieldsType>; // Le type du formulaire est défini ici
} */
export default function RegisterContainer() {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const route = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    setError
  } = useForm<LoginFormFieldsType>();

  const handleLoginUser = async ({ email, password }: LoginFormFieldsType) => {
    try {
      const { error } = await firebaseLoginUser(email, password);
      if (error) {
        setError("root", {
          type: "manual",
          message: error.message || "Erreur d'authentification"
        });
        return;
      }
      // Redirection silencieuse après connexion réussie
      route.push("/checkout");
    } catch (err) {
      console.log(err);
      setError("root", {
        type: "manual",
        message: "Une erreur inattendue s'est produite"
      });
    } finally {
      setisLoading(false);
    }
  };

  const onSubmit: SubmitHandler<LoginFormFieldsType> = async (formdata) => {
    setisLoading(true);
    const { password } = formdata;
    if (password.length < 6) {
      // La validation sera gérée par react-hook-form avec les règles de validation
      setisLoading(false);
      return;
    }
    handleLoginUser(formdata);
  };

  /* const form = {
    errors,
    register,
    handleSubmit,
    onSubmit,
    isLoading,
    watch
  }; */

  return (
    <LoginView form={{ errors, register, handleSubmit, onSubmit, isLoading, watch }} />
  );
}
