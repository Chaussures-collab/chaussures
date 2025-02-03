import { FieldErrors, FieldValues, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

// Définir le type des champs du formulaire
export type FormsType<T extends FieldValues> = {
  errors: FieldErrors<T>; // Accepter les erreurs générées par react-hook-form
  register: UseFormRegister<T>;
  handleSubmit: UseFormHandleSubmit<T>;
  onSubmit: (data: T) => void;
  isLoading: boolean;
};

// Exemple de type pour le formulaire de connexion
export interface LoginFormFieldsType {
  email: string;
  password: string;
}

// Définition des types pour chaque formulaire
export interface RegisterFormFieldsType {
  email: string;
  password: string;
  confirmPassword: string;
  nom: string;
  prenom: string;
  how_did_hear: string;
}

export interface LoginFormFieldsType {
    email: string;
    password: string;
}
export interface ForgetFormFieldsType {
    email: string;
    password: string;
}
