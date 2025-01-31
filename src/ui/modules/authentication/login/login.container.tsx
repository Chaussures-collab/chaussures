/** @format */

import React, { useState } from "react";
import LoginView from "./login.view";
import { FormsType, LoginFormFieldsType } from "@/types/forms";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { firebaseLoginUser } from "@/pages/api/authentification";
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  form: FormsType<LoginFormFieldsType>; // Le type du formulaire est défini ici
}
export default function RegisterContainer() {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const route = useRouter();

  const {
    handleSubmit,
    formState: { errors },
    register
  } = useForm<LoginFormFieldsType>();

  const handleLoginUser = async ({ email, password }: LoginFormFieldsType) => {
    try {
      console.log("Tentative de connexion:", email, password);
      const { error, data } = await firebaseLoginUser(email, password);
      if (error) {
        toast.error(`Erreur d'authentification: ${error.message}`);
        console.error("Erreur détaillée:", error);
        return;
      }
      console.log("Connexion réussie:", data);
      toast.success("Connexion réussie !");
      route.push("/checkout");
    } catch (err) {
      console.error("Erreur inconnue:", err);
      toast.error("Une erreur inattendue s'est produite.");
    } finally {
      setisLoading(false);
    }
  };

  const onSubmit: SubmitHandler<LoginFormFieldsType> = async (formdata) => {
    setisLoading(true);
    const { password } = formdata;
    if (password.length < 6) {
      /* setError("password",{
            type: "manual",
            message: "Password must be at least 6 characters long"
          }) */
      console.log("Password doit comportee au moins 6 caractères");
      toast.error("Password doit comportee au moins 6 caractères");
      setisLoading(false);
      return;
    }
    console.log("Formulaire soumis:", formdata);
    handleLoginUser(formdata);
    console.log("Formulaire soumis:", formdata);
  };

  const form = {
    errors,
    register,
    handleSubmit,
    onSubmit,
    isLoading
  };

  console.log("Formulaire de connexion:", form); // Vérifiez ici.

  return (
    <LoginView form={{ errors, register, handleSubmit, onSubmit, isLoading }} />
  );
}
