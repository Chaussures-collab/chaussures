/** @format */

import React from "react";
import { FormsType,  RegisterFormFieldsType } from "@/types/forms";
import Button from "@/ui/designSystem/button/button";
import { Input } from "@/ui/designSystem/forms/input";

interface Props {
  form: FormsType<RegisterFormFieldsType>; // Le type du formulaire est défini ici
}

export default function RegisterForm({ form }: Props) {
  if (!form) {
    console.error("Form is undefined in RegisterForm.");
    return <div>Error: Form is not defined</div>;
  }

  const {  onSubmit, errors, isLoading, register, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-8 pb-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          isLoading={isLoading}
          label="Nom"
          placeholder="Ex: Dupont"
          type="text"
          register={register}
          errors={errors}
          errorMsg="Champs obligatoire"
          id="nom"
          required={true}
          isAutoCompleted={false}
        />
        <Input
          isLoading={isLoading}
          label="Prenom"
          placeholder="Ex: Lucien"
          type="text"
          register={register}
          errors={errors}
          errorMsg="Champs obligatoire"
          id="prenom"
          required={true}
          isAutoCompleted={false}
        />
      </div>
      <Input
        isLoading={isLoading}
        label="Email"
        placeholder="Ex: email@gmail.com"
        type="email"
        register={register}
        errors={errors}
        errorMsg="Champs obligatoire"
        id="email"
        required={true}
        isAutoCompleted={false}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          isLoading={isLoading}
          label="Mot de passe"
          placeholder="Ex: ......."
          type="password"
          register={register}
          errors={errors}
          errorMsg="Champs obligatoire"
          id="password"
          required={true}
          isAutoCompleted={false}
        />
        <Input
          isLoading={isLoading}
          label="Confirme le mot de passe"
          placeholder="Ex: ......."
          type="password"
          register={register}
          errors={errors}
          errorMsg="Champs obligatoire"
          id="confirmPassword"
          required={true}
          isAutoCompleted={false}
        />
      </div>
      <Input
        isLoading={isLoading}
        label="Comment vous nous aviez connu"
        placeholder="Ex: Facebook, Google, etc."
        register={register}
        errors={errors}
        type="text"
        errorMsg="Champs obligatoire"
        id="how_did_hear"
        required={true}
        isAutoCompleted={false}
      />
      <Button
        isLoading={isLoading}
        fullwidth
        type="submit"
        className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark">
        S{"'"}inscrire
      </Button>
    </form>
  );
}
