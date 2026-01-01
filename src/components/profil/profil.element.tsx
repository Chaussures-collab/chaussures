/** @format */

import { useAuth } from "@/context/AuthUserContext";
import Container from "@/ui/components/container/container";
import Box from "@/ui/designSystem/box/box";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import Avatar from "@/ui/designSystem/avatar/avatar";
import React from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCreditCard,
  FiShoppingBag,
  FiSettings,
  FiBell,
  FiLogOut,
  FiEdit2,
  FiShield,
  FiHelpCircle
} from "react-icons/fi";

interface Props {
  action: () => void;
}

export default function PofilEement({ action }: Props) {
const { authUser, authUserIsLoading } = useAuth();

if (authUserIsLoading) return <p>Chargement...</p>;

console.log("",authUser?.userDocument?.email);
console.log(authUser?.userDocument?.nom);
  /* const userInitials = `${authUser?.prenom?.[0] || ""}${
    authUser?.nom?.[0] || ""
  }`.toUpperCase(); */
  const fullName =
    `${authUser?.prenom || ""} ${authUser?.nom || ""}`.trim() || "Utilisateur";
  console.log("authUser :", authUser);
  return (
    <>
      {/* Header avec avatar et bienvenue */}
      <Container className="my-8">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar
                src={authUser?.photoURL || "/assets/images/profile.jpg"}
                alt={authUser?.nom || "Avatar Utilisateur"}
                size="large"
                className="border-4 border-white shadow-xl object-cover"
              />
              {authUser?.emailVerified && (
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <FiShield className="text-white" size={10} />
                </span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <Typography variant="h2" className="text-white mb-2">
                Bienvenue, {fullName || "Utilisateur"} !
              </Typography>
              <Typography variant="body" className="text-white/90">
                {authUser?.email || "Email non disponible"}
              </Typography>
              {authUser?.emailVerified ? (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                  <FiShield size={14} />
                  Email vérifié
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-200 text-sm">
                  Email non vérifié
                </span>
              )}
            </div>
          </div>
        </div>
      </Container>

      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-4">
        {/* Colonne gauche - Profil et actions rapides */}
        <div className="lg:col-span-4 space-y-4">
          {/* Carte Profil */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h4" className="flex items-center gap-2">
                <FiUser className="text-primary" />
                Informations personnelles
              </Typography>
              <button className="p-2 text-gray-400 hover:text-primary transition">
                <FiEdit2 size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiUser className="text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <Typography variant="caption4" className="text-gray-500">
                    Nom complet
                  </Typography>
                  <Typography variant="body" className="font-medium">
                    {fullName || "Non renseigné"}
                  </Typography>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiMail className="text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <Typography variant="caption4" className="text-gray-500">
                    Email
                  </Typography>
                  <Typography variant="body" className="font-medium">
                    {authUser?.email || "Non renseigné"}
                  </Typography>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FiPhone className="text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <Typography variant="caption4" className="text-gray-500">
                    Téléphone
                  </Typography>
                  <Typography variant="body" className="font-medium">
                    {authUser?.phoneNumber || "Non renseigné"}
                  </Typography>
                </div>
              </div>
            </div>
            <Button
              action={action}
              variant="ico"
              // icon={<FiPhone className="" />}
              className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2">
              <FiLogOut />
              Déconnexion
            </Button>
          </Box>

          {/* Carte Paramètres */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <Typography variant="h4" className="flex items-center gap-2 mb-4">
              <FiSettings className="text-primary" />
              Paramètres
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <FiMapPin className="text-gray-400" />
                <span>Mon adresse</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <FiUser className="text-gray-400" />
                <span>Mes informations personnelles</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <FiShield className="text-gray-400" />
                <span>Changer mon mot de passe</span>
              </li>
            </ul>
            <Button className="w-full mt-4 bg-primary hover:bg-primary-dark text-white">
              Ajouter une adresse
            </Button>
          </Box>

          {/* Carte Commandes */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <Typography variant="h4" className="flex items-center gap-2 mb-4">
              <FiShoppingBag className="text-primary" />
              Commandes
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>Historique de mes commandes</span>
              </li>
            </ul>
          </Box>

          {/* Carte Notifications */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <Typography variant="h4" className="flex items-center gap-2 mb-4">
              <FiBell className="text-primary" />
              Notifications
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>Paramètres des notifications</span>
              </li>
            </ul>
          </Box>
        </div>

        {/* Colonne droite - Sections principales */}
        <div className="lg:col-span-8 space-y-4">
          {/* Carte Paiement */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <Typography variant="h4" className="flex items-center gap-2 mb-4">
              <FiCreditCard className="text-primary" />
              Paiement
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>Mes cartes de crédit</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>Ajouter une carte de crédit</span>
              </li>
            </ul>
          </Box>

          {/* Carte Aide et Support */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <Typography variant="h4" className="flex items-center gap-2 mb-4">
              <FiHelpCircle className="text-primary" />
              Aide et Support
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>Guide d{"'"}utilisation</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>FAQ</span>
              </li>
            </ul>
          </Box>

          {/* Carte Mentions légales */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md hover:shadow-lg transition-shadow">
            <Typography variant="h4" className="mb-4">
              Mentions légales
            </Typography>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>Conditions d{"'"}utilisation</span>
              </li>
              <li className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer transition">
                <span>Mentions légales</span>
              </li>
            </ul>
          </Box>
        </div>
      </Container>
    </>
  );
}
