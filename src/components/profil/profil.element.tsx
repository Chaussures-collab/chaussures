/** @format */

import { useAuth } from "@/context/AuthUserContext";
import Container from "@/ui/components/container/container";
import Box from "@/ui/designSystem/box/box";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import Avatar from "@/ui/designSystem/avatar/avatar";
import React, { useState } from "react";
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
import EditProfileModal from "./modals/EditProfileModal";
import ChangePasswordModal from "./modals/ChangePasswordModal";
import AddAddressModal from "./modals/AddAddressModal";
import { useRouter } from "next/router";

interface Props {
  action: () => void;
}

export default function PofilEement({ action }: Props) {
  const { authUser, authUserIsLoading } = useAuth();
  const router = useRouter();

  // États pour les modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  console.log("authUserzeze", authUser);
  if (authUserIsLoading) {
    return (
      <Container className="py-12">
        <div className="flex flex-col justify-center items-center">
          <div className="mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
          <Typography variant="body" className="text-gray-600">
            Chargement de votre profil...
          </Typography>
        </div>
      </Container>
    );
  }

  // Récupérer les données depuis userDocument.userDocData ou userDocument directement
  const userDocData =
    authUser?.userDocument?.userDocData || authUser?.userDocument;
  const nom = authUser?.nom || userDocData?.nom || null;
  const prenom = authUser?.prenom || userDocData?.prenom || null;
  const phoneNumber = authUser?.phoneNumber || null;
  const email = authUser?.email || userDocData?.email || null;
  const howDidHear = userDocData?.how_did_hear || null;

  // Formater les dates
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (date: any) => {
    if (!date) return "Non disponible";
    try {
      if (date.seconds) {
        return new Date(date.seconds * 1000).toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      if (date instanceof Date) {
        return date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Date invalide";
    }
  };

  const created_at = userDocData?.created_at || null;
  const last_login = userDocData?.last_login || null;

  const fullName = `${prenom || ""} ${nom || ""}`.trim() || "Utilisateur";
  // const userInitials = `${prenom?.[0] || ""}${nom?.[0] || ""}`.toUpperCase() || "U";

  // console.log("isEditProfileOpen", isEditProfileOpen)
  return (
    <>
      {/* Header avec avatar et bienvenue */}
      <Container className="my-8">
        <div className="p-6 bg-gradient-to-r rounded-lg shadow-lg from-primary to-primary-dark md:p-8">
          <div className="flex flex-col gap-6 items-center md:flex-row">
            <div className="relative">
              <Avatar
                src={authUser?.photoURL || "/assets/images/profile.jpg"}
                alt={authUser?.nom || "Avatar Utilisateur"}
                size="large"
                className="object-cover border-4 border-white shadow-xl"
              />
              {authUser?.emailVerified && (
                <span className="flex absolute right-0 bottom-0 justify-center items-center w-5 h-5 bg-green-500 rounded-full border-2 border-white">
                  <FiShield className="text-white" size={10} />
                </span>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <Typography variant="h2" className="mb-2 text-white">
                Bienvenue, {fullName} !
              </Typography>
              <Typography variant="body" className="mb-2 text-white/90">
                {email || "Email non disponible"}
              </Typography>
              <div className="flex flex-wrap gap-2 items-center mt-3">
                {authUser?.emailVerified ? (
                  <span className="inline-flex gap-1 items-center px-3 py-1 text-sm text-white rounded-full bg-white/20">
                    <FiShield size={14} />
                    Email vérifié
                  </span>
                ) : (
                  <span className="inline-flex gap-1 items-center px-3 py-1 text-sm text-yellow-200 rounded-full bg-yellow-500/20">
                    Email non vérifié
                  </span>
                )}
                {authUser?.uid && (
                  <span className="inline-flex gap-1 items-center px-3 py-1 text-xs rounded-full bg-white/10 text-white/80">
                    ID: {authUser.uid.substring(0, 8)}...
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container className="grid grid-cols-1 gap-6 my-4 lg:grid-cols-12">
        {/* Colonne gauche - Profil et actions rapides */}
        <div className="space-y-4 lg:col-span-4">
          {/* Carte Profil */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h4" className="flex gap-2 items-center">
                <FiUser className="text-primary" />
                Informations personnelles
              </Typography>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="p-2 text-gray-400 transition hover:text-primary"
                aria-label="Modifier les informations">
                <FiEdit2 size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex gap-3 items-start">
                  <FiUser className="flex-shrink-0 mt-1 text-gray-400" />
                  <div className="flex-1">
                    <Typography variant="caption4" className="text-gray-500">
                      Prénom
                    </Typography>
                    <Typography variant="body" className="font-medium">
                      {prenom || "Non renseigné"}
                    </Typography>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <FiUser className="flex-shrink-0 mt-1 text-gray-400" />
                  <div className="flex-1">
                    <Typography variant="caption4" className="text-gray-500">
                      Nom
                    </Typography>
                    <Typography variant="body" className="font-medium">
                      {nom || "Non renseigné"}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3 items-start">
                <FiMail className="flex-shrink-0 mt-1 text-gray-400" />
                <div className="flex-1">
                  <Typography variant="caption4" className="text-gray-500">
                    Email
                  </Typography>
                  <Typography variant="body" className="font-medium break-all">
                    {email || "Non renseigné"}
                  </Typography>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex gap-3 items-start">
                <FiPhone className="flex-shrink-0 mt-1 text-gray-400" />
                <div className="flex-1">
                  <Typography variant="caption4" className="text-gray-500">
                    Téléphone
                  </Typography>
                  <Typography variant="body" className="font-medium">
                    {phoneNumber || "Non renseigné"}
                  </Typography>
                </div>
              </div>

              {/* Comment avez-vous entendu parler de nous */}
              {howDidHear && (
                <div className="flex gap-3 items-start">
                  <FiHelpCircle className="flex-shrink-0 mt-1 text-gray-400" />
                  <div className="flex-1">
                    <Typography variant="caption4" className="text-gray-500">
                      Comment avez-vous entendu parler de nous ?
                    </Typography>
                    <Typography
                      variant="body"
                      className="font-medium capitalize">
                      {howDidHear}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
            <Button
              action={action}
              variant="ico"
              // icon={<FiPhone className="" />}
              className="flex gap-2 justify-center items-center mt-4 w-full text-white bg-red-500 hover:bg-red-600">
              <FiLogOut />
              Déconnexion
            </Button>
          </Box>

          {/* Carte Informations du compte */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <Typography variant="h4" className="flex gap-2 items-center mb-4">
              <FiSettings className="text-primary" />
              Informations du compte
            </Typography>
            <div className="space-y-3">
              {authUser?.uid && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Typography variant="caption4" className="mb-1 text-gray-500">
                    Identifiant unique
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="font-mono text-gray-700 break-all">
                    {authUser.uid}
                  </Typography>
                </div>
              )}
              {created_at && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Typography variant="caption4" className="mb-1 text-gray-500">
                    Compte créé le
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="font-medium text-gray-700">
                    {formatDate(created_at)}
                  </Typography>
                </div>
              )}
              {last_login && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <Typography variant="caption4" className="mb-1 text-gray-500">
                    Dernière connexion
                  </Typography>
                  <Typography
                    variant="body-sm"
                    className="font-medium text-gray-700">
                    {formatDate(last_login)}
                  </Typography>
                </div>
              )}
            </div>
          </Box>

          {/* Carte Paramètres */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <Typography variant="h4" className="flex gap-2 items-center mb-4">
              <FiSettings className="text-primary" />
              Paramètres
            </Typography>
            <ul className="space-y-2">
              <li
                onClick={() => setIsAddAddressOpen(true)}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <FiMapPin className="text-gray-400" />
                <span>Mon adresse</span>
              </li>
              <li
                onClick={() => setIsEditProfileOpen(true)}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <FiUser className="text-gray-400" />
                <span>Mes informations personnelles</span>
              </li>
              <li
                onClick={() => setIsChangePasswordOpen(true)}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <FiShield className="text-gray-400" />
                <span>Changer mon mot de passe</span>
              </li>
            </ul>
            <Button
              action={() => setIsAddAddressOpen(true)}
              className="mt-4 w-full text-white bg-primary hover:bg-primary-dark">
              Ajouter une adresse
            </Button>
          </Box>
        </div>

        {/* Colonne droite - Sections principales */}
        <div className="space-y-4 lg:col-span-8">
          {/* Carte Commandes */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <Typography variant="h4" className="flex gap-2 items-center mb-4">
              <FiShoppingBag className="text-primary" />
              Commandes
            </Typography>
            <ul className="space-y-2">
              <li
                onClick={() => router.push("/commandes")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>Historique de mes commandes</span>
              </li>
            </ul>
          </Box>
          {/* Carte Notifications */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <Typography variant="h4" className="flex gap-2 items-center mb-4">
              <FiBell className="text-primary" />
              Notifications
            </Typography>
            <ul className="space-y-2">
              <li
                // onClick={() => router.push("/profil/notifications")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>Paramètres des notifications</span>
              </li>
            </ul>
          </Box>
          {/* Carte Paiement */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <Typography variant="h4" className="flex gap-2 items-center mb-4">
              <FiCreditCard className="text-primary" />
              Paiement
            </Typography>
            <ul className="space-y-2">
              <li
                // onClick={() => router.push("/profil/paiement")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>Mes cartes de crédit</span>
              </li>
              <li
                // onClick={() => router.push("/profil/paiement")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>Ajouter une carte de crédit</span>
              </li>
            </ul>
          </Box>

          {/* Carte Aide et Support */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <Typography variant="h4" className="flex gap-2 items-center mb-4">
              <FiHelpCircle className="text-primary" />
              Aide et Support
            </Typography>
            <ul className="space-y-2">
              <li
                // onClick={() => router.push("/aide")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>Guide d{"'"}utilisation</span>
              </li>
              <li
                // onClick={() => router.push("/faq")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>FAQ</span>
              </li>
            </ul>
          </Box>

          {/* Carte Mentions légales */}
          <Box
            padding_x="8"
            padding_y="8"
            className="p-6 shadow-md transition-shadow hover:shadow-lg">
            <Typography variant="h4" className="mb-4">
              Mentions légales
            </Typography>
            <ul className="space-y-2">
              <li
                // onClick={() => router.push("/conditions-utilisation")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>Conditions d{"'"}utilisation</span>
              </li>
              <li
                // onClick={() => router.push("/mentions-legales")}
                className="flex gap-2 items-center p-2 rounded transition cursor-pointer hover:bg-gray-50">
                <span>Mentions légales</span>
              </li>
            </ul>
          </Box>
        </div>
      </Container>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={() => {
          // Le hook use-firebase-auth mettra à jour automatiquement les données
          setIsEditProfileOpen(false);
        }}
      />

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          setIsChangePasswordOpen(false);
        }}
      />

      <AddAddressModal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        onSuccess={() => {
          setIsAddAddressOpen(false);
        }}
      />
    </>
  );
}
