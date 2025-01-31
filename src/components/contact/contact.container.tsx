/** @format */

import Container from "@/ui/components/container/container";
import { Input } from "@/ui/designSystem/forms/input";
import Typography from "@/ui/designSystem/typography/typography";
import { useForm, SubmitHandler } from "react-hook-form";
import { RiLock2Fill, RiPhoneFill } from "react-icons/ri";

interface FormData {
  nom: string;
  adresseMail: string;
  sujet: string;
  message: string;
}

const ContactContainer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Données soumises :", data);
  };

  // Configuration des champs du formulaire
  const fields = [
    {
      id: "nom",
      label: "Nom",
      placeholder: "Franck",
      type: "text",
      required: true,
    },
    {
      id: "adresseMail",
      label: "Email",
      placeholder: "Adresse mail",
      type: "email",
      required: true,
    },
    {
      id: "sujet",
      label: "Sujet",
      placeholder: "Sujet",
      type: "text",
      required: false,
    },
    {
      id: "message",
      label: "Message",
      placeholder: "Votre message",
      type: "text",
      required: true,
    },
  ];

  // Fonction pour rendre un champ d'entrée
  const renderInputField = (field: (typeof fields)[number]) => (
    <div key={field.id} className="space-y-1">
      <Input
        placeholder={field.placeholder}
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

  return (
    <Container className="py-12 ">
      <div className="text-center space-y-6">
        <Typography variant="h3" component="h3">
          Contactez-nous
        </Typography>
        <Typography variant="body" component="p" className="mb-8">
          Pour plus d{"'"}informations sur nos produits et services, n{"'"}hésitez pas à
          nous envoyer un e-mail. Notre équipe est toujours là pour vous aider.
          Ne soyez pas hésitant !
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center max-w-92">
          <div className="grid m:grid-cols-2 sm:grid-cols-1 space-y-2 justify-center ">
            <div className="flex space-x-4">
              <RiLock2Fill className="text-4xl mt-2"/>
              <div>
                <Typography variant="h4" component="h4">
                  Adresse
                </Typography>
                <Typography variant="body">
                  236 5th SE Avenue, <br /> New York NY10000, <br /> United States
                </Typography>
              </div>
            </div>
            <div className="flex space-x-4">
              <RiPhoneFill className="text-4xl mt-2"/>
              <div>
                <Typography variant="h4" component="h4">
                  Numéro de téléphone
                </Typography>
                <Typography variant="body">
                  Mobile: +(84) 546-6789
                  <br />
                  Hotline: +(84) 456-6789
                </Typography>
              </div>
            </div>
            <div className="flex space-x-4">
              <RiLock2Fill className="text-4xl mt-2"/>
              <div>
                <Typography variant="h4" component="h4">
                  Heure de travail
                </Typography>
                <Typography variant="body">
                  Lundi-Vendredi 09:00 - 22:00, <br /> New York NY10000, <br /> United States
                </Typography>
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-4">
            {fields.map(renderInputField)}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark"
            >
              Envoyer
            </button>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default ContactContainer;
