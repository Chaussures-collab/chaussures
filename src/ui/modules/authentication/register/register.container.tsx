/** @format */

import React, { useState } from "react";
import RegisterView from "./register.view";
import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterFormFieldsType } from "@/types/forms";
import { firebaseCreateUser, firebaseEmailVerification } from "@/pages/api/authentification";
// Toast retiré - utilisation de FormError et validation inline à la place
import { firestoreCreateDoc } from "@/pages/api/firestore";

export default function RegisterContainer() {
  const [isLoading, setisLoading] = useState<boolean>(false);

  const {
    handleSubmit,
    formState: { errors },
    register,
    setError,
    reset,
    watch
  } = useForm<RegisterFormFieldsType>();

  const handleCreateUserDocument = async (
    collectionName: string,
    docId: string,
    document: object
  ) => {
    const { error } = await firestoreCreateDoc(collectionName, docId, document);
    if (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Erreur lors de la création du compte"
      });
      setisLoading(false);
      return;
    }
    setisLoading(false);
    reset();
    firebaseEmailVerification();
    // Redirection silencieuse après inscription réussie
    // route.push("/connexion");
  };

  const handleCreateUserAuth = async ({
    email,
    password,
    nom,
    prenom,
    how_did_hear
  }: RegisterFormFieldsType) => {
    const { error, data } = await firebaseCreateUser(email, password);
    if (error) {
      setError("root", {
        type: "manual",
        message: error.message || "Erreur lors de la création du compte utilisateur"
      });
      setisLoading(false);
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
    
    if (password.length < 6) {
      setError("password", {
        type: "manual",
        message: "Le mot de passe doit contenir au moins 6 caractères"
      });
      setisLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Les deux mots de passe ne correspondent pas"
      });
      setisLoading(false);
      return;
    }
    handleCreateUserAuth(formdata);
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
    <RegisterView
      form={{ errors, register, handleSubmit, onSubmit, isLoading, watch }}
    />
  );
}
