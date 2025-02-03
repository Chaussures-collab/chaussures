/** @format */

import React, { useState } from "react";
import ForgetPasswordView from "./forget-password.view";
import { ForgetFormFieldsType, FormsType } from "@/types/forms";
import { SubmitHandler, useForm } from "react-hook-form";
import { firebaseResetPasswordUser } from "@/pages/api/authentification";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Props {
  form: FormsType<ForgetFormFieldsType>; // Le type du formulaire est défini ici
}
export default function RegisterContainer() {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const route = useRouter();
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset
  } = useForm<ForgetFormFieldsType>();

  const handleResetPassword = async ({ email }: ForgetFormFieldsType) => {
    const { error } = await firebaseResetPasswordUser(email);
    if (error) {
      setisLoading(false);
      console.log("Error creating user:", error);
      toast.error(error.message);
      return;
    }
    console.log("User update successfully:");
    setisLoading(false);
    toast.success(`un mail a été expédié à votre adresse email ${email}`);
    reset();
    route.push("/connexion");
  };

  const onSubmit: SubmitHandler<ForgetFormFieldsType> = async (formdata) => {
    setisLoading(true);
    console.log("Form submitted:", formdata);
    handleResetPassword(formdata);
  };

  const form = {
    errors,
    register,
    handleSubmit,
    onSubmit,
    isLoading
  };

  console.log("Form data in RegisterContainer:", form); // Vérifiez ici.

  return (
    <ForgetPasswordView
      form={{ errors, register, handleSubmit, onSubmit, isLoading }}
    />
  );
}
