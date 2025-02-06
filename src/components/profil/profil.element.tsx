/** @format */

import { useAuth } from "@/context/AuthUserContext";
import Container from "@/ui/components/container/container";
import Box from "@/ui/designSystem/box/box";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import React from "react";
interface Props {
  action: () => void;
}
export default function PofilEement({ action }: Props) {
  const { authUser } = useAuth(); // Utilisation du hook useAuth
  console.log("authUser");
  console.log(authUser);
  console.log(authUser?.userDocument);
  return (
    <>
      <Container className="flex justify-between items-center">
        <Typography variant="h3"> Bienvenu</Typography>
      </Container>

      <Container className="grid grid-cols-12 gap-4 my-4 space-y-4">
        <div className="col-span-12 md:col-span-4 space-y-4">
          <div>
            <Box padding_x="8" padding_y="8" className="p-4 space-y-2">
              <Typography variant="h4">Profil</Typography>
              <p>Nom : {authUser?.nom ?? "........"}</p>
              <p>
                Penom : {`${authUser?.prenom ?? "........"}`}
              </p>
              <p>Numero de téléphone : .....</p>
              <p>
                Email : {`${authUser?.email ??"........"}`}{" "}
              </p>
              <Button action={action} className="bg-danger">
                Deconnexion{" "}
              </Button>
            </Box>
          </div>
          <div>
            <Box padding_x="8" padding_y="8" className="p-2">
              <Typography variant="h4">Paramètres</Typography>
              <ul>
                <li>Mon adresse:</li>
                <li>Mes informations personnelles</li>
                <li>Changer mon mot de passe</li>
              </ul>
              <Button className="bg-danger">Ajouter une adresse</Button>
            </Box>
          </div>
          <div>
            <Box padding_x="8" padding_y="8" className="p-2">
              <Typography variant="h4">Commandes</Typography>
              <ul>
                <li>Historique de mes commandes</li>
              </ul>
            </Box>
          </div>
          <div>
            <Box padding_x="8" padding_y="8" className="p-2">
              <Typography variant="h4">Notifications</Typography>
              <ul>
                <li>Paramètres des notifications</li>
              </ul>
            </Box>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 space-y-4">
          <div>
            <Box padding_x="8" padding_y="8" className="p-2">
              <Typography variant="h4">Paiement</Typography>
              <ul>
                <li>Mes cartes de crédit</li>
                <li>Ajouter une carte de crédit</li>
              </ul>
            </Box>
          </div>
          <div>
            <Box padding_x="8" padding_y="8" className="p-2">
              <Typography variant="h4">Aide et Support</Typography>
              <ul>
                <li>Guide d{"'"}utilisation</li>
                <li>FAQ</li>
              </ul>
            </Box>
          </div>
          <div>
            <Box padding_x="8" padding_y="8" className="p-2">
              <Typography variant="h4">Mentions légales</Typography>
              <ul>
                <li>Conditions d{"'"}utilisation</li>
                <li>Mentions légales</li>
              </ul>
            </Box>
          </div>
          <div>
            <Box padding_x="8" padding_y="8" className="p-2">
              <Typography variant="h4">Support</Typography>
              <ul>
                <li>Contactez-nous</li>
                <li>FAQ</li>
              </ul>
            </Box>
          </div>
        </div>
      </Container>
    </>
  );
}
