import { FormsType, LoginFormFieldsType } from '@/types/forms';
import Button from '@/ui/designSystem/button/button';
import { Input } from '@/ui/designSystem/forms/input';
import React from 'react';

interface Props {
  form: FormsType<LoginFormFieldsType>; // Le type du formulaire est défini ici
}

export default function LoginForm({ form }: Props) {
  const { onSubmit, errors, isLoading, register, handleSubmit } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-8 pb-5 space-y-4">
      <Input
        isLoading={isLoading}
        placeholder="email@gmail.com"
        type="email"
        register={register} // Passer correctement la fonction `register` typée
        errors={errors}
        errorMsg="Champs obligatoire"
        id="email"
        required={true}
        isAutoCompleted={false}
      />
      <Input
        isLoading={isLoading}
        placeholder="Entrer password"
        type="password"
        register={register} // Passer correctement la fonction `register` typée
        errors={errors}
        errorMsg="Champs obligatoire"
        id="password"
        required={true}
        isAutoCompleted={false}
      />
      <Button isLoading={isLoading} fullwidth type="submit">
        S{"'"}inscrire
      </Button>
    </form>
  );
}
