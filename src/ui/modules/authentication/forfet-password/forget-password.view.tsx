/** @format */

import Box from "@/ui/designSystem/box/box";
import Typography from "@/ui/designSystem/typography/typography";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import Container from "@/ui/components/container/container";
import ForgetPasswordForm from "./forgetPasswordForm";
import { ForgetFormFieldsType, FormsType } from "@/types/forms";
interface Props {
  form: FormsType<ForgetFormFieldsType>; // Le type du formulaire est défini ici
}
export default function ForgetPasswordView({form}:Props) {
  return (
    <Container className="grid grid-cols-1  my-4 sm:grid-cols-2 sm:gap-2">
          <div className="flex items-center hidden sm:flex">
        <div className="relative w-full h-[531px]">
          <Image
            fill
            src="/assets/images/accueil.png"
            alt="sikirou"
            className="object-center rounded objet-cover "
          />
        </div>
      </div>
      <div className="flex items-center ">
        <Box padding_y="py-4" padding_x="px-4">
          <div className="flex items-center justify-between">
            <Typography variant="h5" component="h1" className="text-primary">
              Réinitialisez
            </Typography>
            <div className="flex flex-wrap items-center ml-4 gap-2 hidden m:flex">
              <Typography variant="caption4" component="span" theme="gray">
                Tu a déjà un compte
              </Typography>
              <Typography variant="caption4" component="span" theme="primary">
                <Link href="/connexion/inscription">Insciption</Link>
              </Typography>
            </div>
          </div>
          <div>
            <ForgetPasswordForm form={form}
            />
          </div>
          <div className="flex flex-wrap justify-center items-center ml-4 gap-2">
              <Typography variant="caption4" component="span" theme="gray">
                Tu a déjà un compte
              </Typography>
              <Typography variant="caption4" component="span" theme="primary">
                <Link href="/connexion/inscription">Insciption</Link>
              </Typography>
            </div>
        </Box>
      </div>
    </Container>
  );
}
