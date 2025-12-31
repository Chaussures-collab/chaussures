/** @format */

import { FormsType, LoginFormFieldsType } from "@/types/forms";
import Button from "@/ui/designSystem/button/button";
import { Input } from "@/ui/designSystem/forms/input";
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface Props {
  form: FormsType<LoginFormFieldsType>;
}

export default function LoginForm({ form }: Props) {
  const { onSubmit, errors, isLoading, register, handleSubmit, watch } = form;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-8 pb-5 space-y-4">
      {/* Affichage des erreurs générales */}
      {errors.root && (
        <div className="p-3 mb-4 bg-red-50 border border-red-400 rounded-md">
          <p className="text-danger text-sm">
            {errors.root.message as string}
          </p>
        </div>
      )}

      {/* EMAIL */}
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

      {/* PASSWORD */}
      <div className="relative item-center">
        <Input
          isLoading={isLoading}
          placeholder="Mot de passe"
          label="Mot de passe"
          type={showPassword ? "text" : "password"}
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

        {/* TOGGLE SHOW / HIDE */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-3/4 -translate-y-1/2 text-gray-500 hover:text-primary transition"
          aria-label={
            showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }>
          {showPassword ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </button>
      </div>

      {/* SUBMIT */}
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
