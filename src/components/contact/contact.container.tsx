/** @format */

import Container from "@/ui/components/container/container";
import emailjs from "emailjs-com";
import { Input } from "@/ui/designSystem/forms/input";
import Typography from "@/ui/designSystem/typography/typography";
import { useForm, SubmitHandler } from "react-hook-form";
import { RiLock2Fill, RiPhoneFill } from "react-icons/ri";
import { useState } from "react";
import Button from "@/ui/designSystem/button/button";
import { toast } from "react-toastify";

interface FormData {
  nom: string;
  adresseMail: string;
  sujet: string;
  message: string;
}

const ContactContainer = () => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const handleMessageMail = (data: FormData) => {
    console.log("Envoi du mail...");
    const templateParams = {
      from_name: data.nom,
      reply_to: data.adresseMail,
      message: data.message,
      sujet: data.sujet,
      to_email: "enlignechaussures@gmail.com" // Destination
    };

    emailjs
      .send(
        "service_v9jsj28", // Remplace par ton service ID
        "template_qrinzfc", // Remplace par ton template ID
        templateParams,
        "PVVkJyq_LdxNGmNBV" // Remplace par ton user ID
      )
      .then((response) => {
        console.log(
          "E-mail envoyé avec succès",
          response.status,
          response.text
        );
        toast.success("Votre message a été envoyé avec succès");
        reset(); // Reset form after submission
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'e-mail", error);
        toast.error("Une erreur est survenue lors de l'envoi de votre message");
      })
      .finally(() => {
        setisLoading(false); // Désactive le loading une fois l'opération terminée
      });
  };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Données soumises :", data);
    setisLoading(true);
    handleMessageMail(data); // Envoi de l'email
    setisLoading(false); // Reset loading state after successful submission
  };

  // Configuration des champs du formulaire
  const fields = [
    {
      id: "nom",
      label: "Nom",
      placeholder: "Nom*",
      type: "text",
      required: true
    },
    {
      id: "adresseMail",
      label: "Email",
      placeholder: "Adresse mail*",
      type: "email",
      required: true
    },
    {
      id: "sujet",
      label: "Sujet",
      placeholder: "Sujet*",
      type: "text",
      required: false
    },
    {
      id: "message",
      label: "Message",
      placeholder: "Votre message*",
      type: "text",
      required: true
    }
  ];

  // Fonction pour rendre un champ d'entrée
  const renderInputField = (field: (typeof fields)[number]) => (
    <div key={field.id} className="space-y-1">
      <Input
        placeholder={field.placeholder}
        label={field.label}
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

  console.log(isLoading);
  return (
    <Container className="py-12 ">
      <div className="text-center space-y-6">
        <Typography variant="h3" component="h3">
          Contactez-nous
        </Typography>
        <Typography variant="body" component="p" className="mb-8 text-gray-500">
          Pour plus d{"'"}informations sur nos produits et services, n{"'"}
          hésitez pas à nous envoyer un e-mail. Notre équipe est toujours là
          pour vous aider. Ne soyez pas hésitant !
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6  w-full max-w-5xl mx-auto space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center max-w-92">
          <div className="grid m:grid-cols-2 sm:grid-cols-1 space-y-2 justify-center ">
            <div className="flex space-x-4">
              <RiLock2Fill className="text-2xl mt-2" />
              <div>
                <Typography variant="h5" component="h5">
                  Adresse
                </Typography>
                <Typography variant="body" className="text-gray-500">
                  68 Rue Saint-Ferréot, <br /> 13000 Marseille, France
                  <br /> Etage E
                </Typography>
              </div>
            </div>
            <div className="flex space-x-4">
              <RiPhoneFill className="text-2xl mt-2" />
              <div>
                <Typography variant="h5" component="h5">
                  Numéro de téléphone
                </Typography>
                <Typography variant="body" className="text-gray-500">
                  Mobile: +(33) 760604485
                  <br />
                  Hotline: +(33) 760604485
                </Typography>
              </div>
            </div>
            <div className="flex space-x-4">
              <RiLock2Fill className="text-2xl mt-2" />
              <div>
                <Typography variant="h5" component="h5">
                  Heure de travail
                </Typography>
                <Typography variant="body" className="text-gray-500">
                  Lundi-Samedi 09:00 - 22:00
                </Typography>
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-4">
            {fields.map(renderInputField)}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark">
              Envoyer
            </Button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default ContactContainer;
