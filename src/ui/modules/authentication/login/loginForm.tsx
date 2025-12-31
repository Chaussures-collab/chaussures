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
  const { onSubmit, errors, isLoading, register, handleSubmit } = form;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-8 pb-5 space-y-4">
      {/* EMAIL */}
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

      {/* PASSWORD */}
      <div className="relative item-center">
        <Input
          isLoading={isLoading}
          placeholder="Mot de passe"
          label="Email"
          type={showPassword ? "text" : "password"}
          register={register}
          errors={errors}
          errorMsg="Champs obligatoire"
          id="password"
          required={true}
          isAutoCompleted={false}
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
