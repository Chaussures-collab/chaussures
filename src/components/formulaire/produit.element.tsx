/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

/** @format */

import { storage } from "@/config/firebase-config";
import { useAuth } from "@/context/AuthUserContext";
import { firestoreCreateDocProduit } from "@/pages/api/firestore";
import { ProduitType } from "@/types/produitType";
import Container from "@/ui/components/container/container";
import { Input } from "@/ui/designSystem/forms/input";
import Typography from "@/ui/designSystem/typography/typography";
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
  UploadTask
} from "firebase/storage";
//import Image from "next/image";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface FormData {
  produit: ProduitType;
}

export default function ProduitElement() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to handle product creation
  const handleAddProduct = async (collectionName: string, data: object) => {
    setIsLoading(true); // Set loading to true when submitting
    const { error } = await firestoreCreateDocProduit(collectionName, data);
    if (error) {
      toast.error(error.message);
      setIsLoading(false); // Reset loading state on error
      return;
    }
    console.log("Produit créé avec succès:", data);
    toast.success("Produit créé avec succès");
    reset(); // Reset form after submission
    setIsLoading(false); // Reset loading state after successful submission
  };
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log("Données brutes soumises :", data);

    const produitData: ProduitType = {
      nom: data.nom,
      description: data.description,
      description1: data.description1,
      quantiteStock: Number(data.quantiteStock), // Convertir en nombre
      prix: Number(data.prix), // Convertir en nombre
      prixPromo: data.prixPromo ? Number(data.prixPromo) : null // Convertir en nombre
    };

    console.log("Données transformées :", produitData);

    handleAddProduct("products", produitData);
    handleImageUploade();
  };
  const [selectImage, setSelectImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );

  console.log("imagePreview", imagePreview);
  const hundleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      setSelectImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        let imgDataUrl: string | ArrayBuffer | null = null;
        if (e.target) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          imgDataUrl = e.target.result;
        }
        setImagePreview(imgDataUrl);
      };
      reader.readAsDataURL(file);
          handleImageUploade();

    }
  };

  // Fields configuration for form
  const fields: {
    id: string;
    label: string;
    placeholder: string;
    type: "text" | "email" | "password" | "tel" | "number" | "file";
    required: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }[] = [
    {
      id: "nom",
      label: "Nom",
      placeholder: "Nom du produit",
      type: "text",
      required: true
    },
    {
      id: "description",
      label: "Description",
      placeholder: "Description du produit",
      type: "text",
      required: true
    },
    {
      id: "description1",
      label: "Description secondaire",
      placeholder: "Description secondaire",
      type: "text",
      required: false
    },
    {
      id: "quantiteStock",
      label: "Quantité en stock",
      placeholder: "Quantité en stock",
      type: "number",
      required: true
    },
    {
      id: "prix",
      label: "Prix",
      placeholder: "Prix du produit",
      type: "number",
      required: true
    },
    {
      id: "prixPromo",
      label: "Prix promotionnel",
      placeholder: "Prix promotionnel",
      type: "number",
      required: false
    },
    {
      id: "image",
      label: "Image du produit",
      placeholder: "Image du produit",
      type: "file",
      required: true
    }
  ];

  // Render an input field with error handling
  const renderInputField = (field: (typeof fields)[number]) => (
    <div key={field.id} className="space-y-1">
      <Input
        placeholder={field.placeholder}
        type={field.type}
        register={register}
        errors={errors}
        id={field.id as keyof FormData}
        errorMsg={`Veuillez entrer ${field.label.toLowerCase()}`}
        required={field.required}
        className="h-10 p-2"
        aria-label={field.label}
      />
    </div>
  );
  const { authUser } = useAuth(); // Utilisation du hook useAuth
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Utilisation du hook useState pour gérer la progression du téléchargement
  console.log(uploadProgress)

  const handleImageUploade = () => {
    let storageRef: StorageReference;
    let uploadTask: UploadTask;
    console.log("uploadProgress", uploadProgress)

    if (selectImage != null) {
      storageRef = ref(
        storage,
        `users-medias/${authUser.uid}/avatar-${authUser.uid}`
      );

      uploadTask = uploadBytesResumable(storageRef, selectImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Mettre à jour la progression du téléchargement
        },
        (error) => {
          console.log("error", error);
          toast.error(
            "Une erreur est survenue lors du téléchargement de l'image"
          ); // Afficher un message d'erreur si le téléchargement échoue
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    }
  };
  return (
    <Container className="py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="gap-8">
          <div className="space-y-8">
            <Typography variant="h5" component="h1">
              FORMULAIRE D{"'"}ENREGISTREMENT DE PRODUIT
            </Typography>
            {fields.map(renderInputField)}{" "}
            <div>
              <label htmlFor="image">
                {/* <div>
                  <Image
                    src={
                      imagePreview && typeof imagePreview === "string"
                        ? imagePreview
                        : "/assets/images/Slide1.png"
                    }
                    alt="Image Preview"
                    className="w-full h-48 object-cover"
                  />
                </div> */}
                Image du produit
                <input
                  type="file"
                  onChange={hundleImageSelect}
                />
              </label>
            </div>
            {/* Rendering all fields dynamically */}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark"
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? "Chargement..." : "Ajouter le produit"}
            </button>
          </div>
        </div>
      </form>
    </Container>
  );
}
