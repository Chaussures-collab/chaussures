import { ForgetFormFieldsType, FormsType } from '@/types/forms';
import Button from '@/ui/designSystem/button/button';
import { Input } from '@/ui/designSystem/forms/input';
import React from 'react'

interface Props {
  form: FormsType<ForgetFormFieldsType>; // Le type du formulaire est défini ici
}
export default function ForgetPasswordForm({form}:Props) {
    const {  onSubmit, errors, isLoading, register, handleSubmit } = form;

  return (
      <form onSubmit={handleSubmit(onSubmit)} className= "pt-8 pb-5 space-y-4">
        <Input
          isLoading={isLoading}
          placeholder="Email@gmail.com"
          type="email"
          register={register}
          errors={errors}
          errorMsg="Champs obligatoire"
          id="email"
          required={true}
          isAutoCompleted={false}
        />
        <Button isLoading={isLoading} fullwidth type="submit">
          Envoyer
        </Button>
      </form>
    );
}
