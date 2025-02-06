/** @format */

import React, { useState } from "react";
import RegisterView from "./register.view";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterFormFieldsType } from "@/types/forms";
import { firebaseCreateUser, firebaseEmailVerification } from "@/pages/api/authentification";
import { toast } from "react-toastify";
import { firestoreCreateDoc } from "@/pages/api/firestore";
//import useToggle from "@/hooks/use-toggle";

export default function RegisterContainer() {
  const [isLoading, setisLoading] = useState<boolean>(false);
  //const {isLoading, setIsLoading} = useToggle();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    reset
  } = useForm<RegisterFormFieldsType>();

  const handleCreateUserDocument = async (
    collectionName: string,
    docId: string,
    document: object
  ) => {
    const { error } = await firestoreCreateDoc(collectionName, docId, document);
    if (error) {
      toast.error(error.message);
      return;
    }
    console.log("User created successfully:", document);
    setisLoading(false);
    toast.success("Votre compte a été créée avec succès");
    reset();
    firebaseEmailVerification();
  };

  const handleCreateUserAuth = async ({
    email,
    password,
    nom,
    prenom,
    how_did_hear
  }: RegisterFormFieldsType) => {
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("How did he hear:", how_did_hear);
    const { error, data } = await firebaseCreateUser(email, password);
    if (error) {
      setisLoading(false);
      console.log("Error creating user:", error);
      return;
    }
    const userDocData = {
      email: email,
      how_did_hear: how_did_hear,
      nom: nom,
      prenom: prenom,
      last_login: new Date(),
      uid: data.uid,
      created_at: new Date()
    };
    handleCreateUserDocument("users", data.uid, {
      userDocData
    });
  };

  const onSubmit: SubmitHandler<RegisterFormFieldsType> = async (formdata) => {
    setisLoading(true);
    const { password, confirmPassword } = formdata;
    console.log("Password:", password);
    if (password.length < 6) {
      setError("password", {
        type: "manual",
        message: "Password must be at least 6 characters long"
      });
      console.log("Password doit contenu au moins 6 caractère");
      toast.error("Password doit contenu au moins 6 caractère");
      setisLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Vos deux passwords sont pas identiques"
      });
      toast.error("Vos deux passwords sont pas identiques");
      setisLoading(false);
      return;
    }
    console.log("Form soumit:", formdata);
    handleCreateUserAuth(formdata);
  };

  const form = {
    errors,
    register,
    handleSubmit,
    onSubmit,
    isLoading
  };

  console.log("Les données du formulaire sont:", form); // Vérifiez ici.

  return (
    <RegisterView
      form={{ errors, register, handleSubmit, onSubmit, isLoading }}
    />
  );
}
