/** @format */

import Container from "@/ui/components/container/container";
import emailjs from "emailjs-com";
import { Input } from "@/ui/designSystem/forms/input";
import Typography from "@/ui/designSystem/typography/typography";
import { useForm, SubmitHandler } from "react-hook-form";
import { RiPhoneFill, RiMailFill, RiUserFill } from "react-icons/ri";
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
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);

    try {
      await emailjs.send(
        "service_v9jsj28",
        "template_qrinzfc",
        {
          from_name: data.nom,
          reply_to: data.adresseMail,
          sujet: data.sujet,
          message: data.message,
          to_email: "enlignechaussures@gmail.com"
        },
        "PVVkJyq_LdxNGmNBV"
      );

      toast.success("Message envoyé avec succès 🚀");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi du message ❌");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 max-w-6xl mx-auto">
        {/* 🧾 INFOS */}
        <div className="space-y-8">
          <Typography
            variant="h3"
            component="h2"
            className="text-4xl font-bold text-gray-900">
            Parlons de votre projet 👋
          </Typography>

          <Typography className="text-gray-600 leading-relaxed">
            Une question, une collaboration ou un besoin spécifique ? Remplissez
            le formulaire et notre équipe vous répondra rapidement.
          </Typography>

          <div className="space-y-6">
            <InfoCard
              icon={<RiPhoneFill />}
              title="Téléphone"
              value="+33 7 60 60 44 85"
            />
            <InfoCard
              icon={<RiMailFill />}
              title="Email"
              value="enlignechaussures@gmail.com"
            />
            <InfoCard
              icon={<RiUserFill />}
              title="Disponibilité"
              value="Lundi – Samedi : 09h00 – 22h00"
            />
          </div>
        </div>

        {/* ✉️ FORMULAIRE */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Nom"
              placeholder="Votre nom"
              register={register}
              errors={errors}
              id="nom"
              required
            />

            <Input
              label="Email"
              placeholder="Votre adresse email"
              register={register}
              errors={errors}
              id="adresseMail"
              required
              type="email"
            />

            <Input
              label="Sujet"
              placeholder="Sujet du message"
              register={register}
              errors={errors}
              id="sujet"
            />

            {/* MESSAGE */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                {...register("message", { required: true })}
                rows={5}
                placeholder="Écrivez votre message ici..."
                className="w-full rounded-xl border border-gray-200 p-4 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {errors.message && (
                <p className="text-sm text-red-500">
                  Veuillez écrire un message
                </p>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-primary-dark hover:scale-[1.02] transition-all shadow-lg">
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default ContactContainer;

/* 🧩 COMPOSANT INFO */
const InfoCard = ({
  icon,
  title,
  value
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 p-6 rounded-2xl bg-gray-50 hover:bg-white border border-gray-100 shadow-md transition">
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);
