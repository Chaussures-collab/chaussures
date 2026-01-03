/** @format */

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Modal from "@/ui/designSystem/modal/Modal";
import { Input } from "@/ui/designSystem/forms/input";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import FormError from "@/ui/designSystem/forms/FormError";
import { useAuth } from "@/context/AuthUserContext";
import { firestoreUpdateDoc } from "@/pages/api/firestore";
import { updateProfile } from "firebase/auth";
import { auth } from "@/config/firebase-config";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ProfileFormData {
  prenom: string;
  nom: string;
  phoneNumber: string;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  onSuccess
}: EditProfileModalProps) {
  const { authUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userDocData = authUser?.userDocument?.userDocData || authUser?.userDocument;
  const currentPrenom = authUser?.prenom || userDocData?.prenom || "";
  const currentNom = authUser?.nom || userDocData?.nom || "";
  const currentPhoneNumber = authUser?.phoneNumber || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProfileFormData>({
    defaultValues: {
      prenom: currentPrenom,
      nom: currentNom,
      phoneNumber: currentPhoneNumber
    }
  });

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      reset({
        prenom: currentPrenom,
        nom: currentNom,
        phoneNumber: currentPhoneNumber
      });
      setError(null);
    }
  }, [isOpen, currentPrenom, currentNom, currentPhoneNumber, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!authUser?.uid) {
      setError("Utilisateur non connecté");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mettre à jour dans Firestore
      // Si la structure utilise userDocData, on doit mettre à jour l'objet imbriqué
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let updateData: any = {};
      
      // Récupérer le document actuel pour préserver les autres données
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/config/firebase-config");
      
      const userDocRef = doc(db, "users", authUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const currentData = userDocSnap.data();
        
        // Si la structure utilise userDocData
        if (currentData.userDocData) {
          updateData = {
            userDocData: {
              ...currentData.userDocData,
              nom: data.nom,
              prenom: data.prenom
            }
          };
        } else {
          // Créer la structure userDocData si elle n'existe pas
          updateData = {
            userDocData: {
              ...currentData,
              nom: data.nom,
              prenom: data.prenom,
              uid: authUser.uid,
              email: authUser.email
            }
          };
        }
      } else {
        // Document n'existe pas encore
        updateData = {
          userDocData: {
            nom: data.nom,
            prenom: data.prenom,
            uid: authUser.uid,
            email: authUser.email,
            created_at: new Date(),
            last_login: new Date()
          }
        };
      }

      const { error: firestoreError } = await firestoreUpdateDoc(
        "users",
        authUser.uid,
        updateData
      );

      if (firestoreError) {
        throw new Error(firestoreError.message || "Erreur lors de la mise à jour");
      }

      // Mettre à jour le numéro de téléphone dans Firebase Auth si fourni
      /* if (data.phoneNumber && auth.currentUser) {
        await updateProfile(auth.currentUser, {
          phoneNumber: data.phoneNumber
        });
      } */

      // Succès
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors de la mise à jour"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier mes informations">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormError message={error || undefined} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input<ProfileFormData>
            id="prenom"
            label="Prénom"
            type="text"
            placeholder="Votre prénom"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le prénom est requis"
            validationRules={{
              minLength: {
                value: 2,
                message: "Le prénom doit contenir au moins 2 caractères"
              }
            }}
          />

          <Input<ProfileFormData>
            id="nom"
            label="Nom"
            type="text"
            placeholder="Votre nom"
            register={register}
            errors={errors}
            watch={watch}
            required
            errorMsg="Le nom est requis"
            validationRules={{
              minLength: {
                value: 2,
                message: "Le nom doit contenir au moins 2 caractères"
              }
            }}
          />
        </div>

        <Input<ProfileFormData>
          id="phoneNumber"
          label="Numéro de téléphone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          register={register}
          errors={errors}
          watch={watch}
          errorMsg="Format de téléphone invalide"
          validationRules={{
            pattern: {
              value: /^(\+33|0)[1-9](\d{2}){4}$/,
              message: "Format de téléphone invalide (ex: +33 6 12 34 56 78)"
            }
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
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </Modal>
  );
}

