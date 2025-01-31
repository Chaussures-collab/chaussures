/** @format */

import React from "react";
import Container from "@/ui/components/container/container";
import Image from "next/image";
import Box from "@/ui/designSystem/box/box";
import Typography from "@/ui/designSystem/typography/typography";
import Link from "next/link";
import RegisterForm from "./register.form";
import { FormsType, RegisterFormFieldsType } from "@/types/forms";

interface Props {
  form: FormsType<RegisterFormFieldsType>; // Le type du formulaire est défini ici
}

export default function RegisterView({ form }: Props) {
  if (!form) {
    console.error("Form is undefined in RegisterView.");
    return <div>Error: Form is not defined</div>;
  }

  return (
    <Container className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:space-x-6 mb-2">
      <div className="flex">
        <div className="relative w-full h-[531px] hidden sm:flex">
          <Image
            fill
            src="/assets/images/accueil.png"
            alt="sikirou"
            className="object-center rounded objet-cover "
          />
        </div>
      </div>
      <div className="flex items-center">
        <Box padding_y="py-4" padding_x="px-4">
          <div className="flex justify-between">
            <Typography variant="h5" component="h1" className="text-primary">
              Inscription
            </Typography>
            <div className="flex flex-wrap items-center ml-4 gap-2 hidden m:flex">
              <Typography variant="caption4" component="span" theme="gray">
                Tu a déjà un compte
              </Typography>
              <Typography variant="caption4" component="span" theme="primary">
                <Link href="/connexion">Connexion</Link>
              </Typography>
            </div>
          </div>
          <div>
            <RegisterForm form={form} />
          </div>
          <div className="flex flex-wrap justify-center items-center ml-4 gap-2">
            <Typography variant="caption4" component="span" theme="gray">
              Tu a déjà un compte
            </Typography>
            <Typography variant="caption4" component="span" theme="primary">
              <Link href="/connexion">Connexion</Link>
            </Typography>
          </div>
        </Box>
      </div>
    </Container>
  );
}
