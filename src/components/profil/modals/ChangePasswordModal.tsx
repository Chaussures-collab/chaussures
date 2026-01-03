/** @format */

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from "@/ui/designSystem/modal/Modal";
import { Input } from "@/ui/designSystem/forms/input";
import Button from "@/ui/designSystem/button/button";
import FormError from "@/ui/designSystem/forms/FormError";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth } from "@/config/firebase-config";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess
}: ChangePasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCurrentPassword] = useState(false);
  const [showNewPassword] = useState(false);
  const [showConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<PasswordFormData>();

  useEffect(() => {
    if (isOpen) {
      reset();
      setError(null);
    }
  }, [isOpen, reset]);

  const newPassword = watch("newPassword");

  const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      setError("Utilisateur non connecté");
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas");
      return;
    }

    if (data.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Réauthentifier l'utilisateur
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Mettre à jour le mot de passe
      await updatePassword(auth.currentUser, data.newPassword);

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === "auth/wrong-password") {
        setError("Mot de passe actuel incorrect");
      } else if (err.code === "auth/weak-password") {
        setError("Le nouveau mot de passe est trop faible");
      } else {
        setError(err.message || "Une erreur s'est produite lors de la mise à jour");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Changer mon mot de passe">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormError message={error || undefined} />

        <Input<PasswordFormData>
          id="currentPassword"
          label="Mot de passe actuel"
          type={showCurrentPassword ? "text" : "password"}
          placeholder="Entrez votre mot de passe actuel"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="Le mot de passe actuel est requis"
        />

        <Input<PasswordFormData>
          id="newPassword"
          label="Nouveau mot de passe"
          type={showNewPassword ? "text" : "password"}
          placeholder="Entrez votre nouveau mot de passe"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="Le nouveau mot de passe est requis"
          validationRules={{
            minLength: {
              value: 6,
              message: "Le mot de passe doit contenir au moins 6 caractères"
            }
          }}
        />

        <Input<PasswordFormData>
          id="confirmPassword"
          label="Confirmer le nouveau mot de passe"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirmez votre nouveau mot de passe"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="La confirmation est requise"
          validationRules={{
            validate: (value: string) =>
              value === newPassword || "Les mots de passe ne correspondent pas"
          }}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            action={onClose}
            className="flex-1"
            disabled={isLoading}>
            Annuler
          </Button>
          <Button
            type="submit"
            variant="accent"
            className="flex-1"
            isLoading={isLoading}
            disabled={isLoading}>
            Changer le mot de passe
          </Button>
        </div>
      </form>
    </Modal>
  );
}

