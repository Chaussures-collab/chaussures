/** @format */

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from "@/ui/designSystem/modal/Modal";
import { Input } from "@/ui/designSystem/forms/input";
import Button from "@/ui/designSystem/button/button";
import FormError from "@/ui/designSystem/forms/FormError";
import { useAuth } from "@/context/AuthUserContext";
import { firestoreUpdateDoc } from "@/pages/api/firestore";

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AddressFormData {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  addressName: string;
}

export default function AddAddressModal({
  isOpen,
  onClose,
  onSuccess
}: AddAddressModalProps) {
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<AddressFormData>();

  useEffect(() => {
    if (isOpen) {
      reset();
      setError(null);
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    if (!authUser?.uid) {
      setError("Utilisateur non connecté");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implémenter la logique de sauvegarde d'adresse
      // Pour l'instant, on simule une sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de l'ajout de l'adresse"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une adresse" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormError message={error || undefined} />

        <Input<AddressFormData>
          id="addressName"
          label="Nom de l'adresse"
          type="text"
          placeholder="Ex: Domicile, Bureau..."
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="Le nom de l'adresse est requis"
        />

        <Input<AddressFormData>
          id="street"
          label="Rue et numéro"
          type="text"
          placeholder="123 Rue de la République"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="L'adresse est requise"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input<AddressFormData>
            id="postalCode"
            label="Code postal"
            type="text"
            placeholder="75001"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le code postal est requis"
            validationRules={{
              pattern: {
                value: /^\d{5}$/,
                message: "Code postal invalide (5 chiffres)"
              }
            }}
          />

          <Input<AddressFormData>
            id="city"
            label="Ville"
            type="text"
            placeholder="Paris"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="La ville est requise"
          />
        </div>

        <Input<AddressFormData>
          id="country"
          label="Pays"
          type="text"
          placeholder="France"
          register={register}
          errors={errors}
          watch={watch}
          required
          errorMsg="Le pays est requis"
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
            Enregistrer l{"'"}adresse
          </Button>
        </div>
      </form>
    </Modal>
  );
}

