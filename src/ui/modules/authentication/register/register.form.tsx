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

  const { onSubmit, errors, isLoading, register, handleSubmit, watch } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-8 pb-5 space-y-4">
      {/* Affichage des erreurs générales */}
      {errors.root && (
        <div className="p-3 mb-4 bg-red-50 border border-red-400 rounded-md">
          <p className="text-danger text-sm">{errors.root.message as string}</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          isLoading={isLoading}
          label="Nom"
          placeholder="Ex: Dupont"
          type="text"
          register={register}
          errors={errors}
          errorMsg="Le nom est requis"
          id="nom"
          required={true}
          isAutoCompleted={false}
          watch={watch}
        />
        <Input
          isLoading={isLoading}
          label="Prenom"
          placeholder="Ex: Lucien"
          type="text"
          register={register}
          errors={errors}
          errorMsg="Le prénom est requis"
          id="prenom"
          required={true}
          isAutoCompleted={false}
          watch={watch}
        />
      </div>
      <Input
        isLoading={isLoading}
        label="Email"
        placeholder="Ex: email@gmail.com"
        type="email"
        register={register}
        errors={errors}
        errorMsg="Veuillez entrer une adresse email valide"
        id="email"
        required={true}
        isAutoCompleted={false}
        watch={watch}
        validationRules={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Format d'email invalide"
          }
        }}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          isLoading={isLoading}
          label="Mot de passe"
          placeholder="••••••••••"
          type="password"
          register={register}
          errors={errors}
          errorMsg="Le mot de passe est requis"
          id="password"
          required={true}
          isAutoCompleted={false}
          watch={watch}
          validationRules={{
            minLength: {
              value: 6,
              message: "Le mot de passe doit contenir au moins 6 caractères"
            }
          }}
        />
        <Input
          isLoading={isLoading}
          label="Confirme le mot de passe"
          placeholder="••••••••••"
          type="password"
          register={register}
          errors={errors}
          errorMsg="La confirmation du mot de passe est requise"
          id="confirmPassword"
          required={true}
          isAutoCompleted={false}
          watch={watch}
          validationRules={{
            validate: (value: string) => {
              if (!watch) return true;
              const password = watch("password");
              return (
                value === password ||
                "Les deux mots de passe ne correspondent pas"
              );
            }
          }}
        />
      </div>
      <Input
        isLoading={isLoading}
        label="Comment vous nous aviez connu"
        placeholder="Ex: Facebook, Google, etc."
        register={register}
        errors={errors}
        type="text"
        errorMsg="Ce champ est requis"
        id="how_did_hear"
        required={true}
        isAutoCompleted={false}
        watch={watch}
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
