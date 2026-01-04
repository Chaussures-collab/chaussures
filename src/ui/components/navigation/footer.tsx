/** @format */

import React, { useState } from "react";
import Container from "../container/container";
import Typography from "@/ui/designSystem/typography/typography";
import { footerLinks } from "./app-link";
import { v4 as uuidv4 } from "uuid";
import ActiveLink from "./active-link";
import { FooterLink } from "@/types/app-links";
import { LinkType } from "@/lib/link-type";
import Avatar from "@/ui/designSystem/avatar/avatar";
import { FiMail, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  // Générer la liste dynamique des liens du footer
  const footNavigationList = footerLinks.map((columnLinks) => (
    <FooterLinks key={uuidv4()} data={columnLinks} />
  ));

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la logique d'abonnement
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Colonne 1: À propos */}
          <div className="flex flex-col space-y-4">
            <Typography variant="h4" className="font-bold text-gray-900 mb-2">
              Market
            </Typography>
            <Typography variant="body-base" className="text-gray-600">
              Votre boutique en ligne pour des produits de qualité, pratiques et
              sécurisés. Nous nous engageons à vous offrir la meilleure expérience d{"'"}achat.
            </Typography>
            {/* Réseaux sociaux */}
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-primary hover:border-primary hover:text-white text-gray-700 flex items-center justify-center transition-colors">
                <FiFacebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-primary hover:border-primary hover:text-white text-gray-700 flex items-center justify-center transition-colors">
                <FiTwitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-primary hover:border-primary hover:text-white text-gray-700 flex items-center justify-center transition-colors">
                <FiInstagram size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:bg-primary hover:border-primary hover:text-white text-gray-700 flex items-center justify-center transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Colonnes de liens */}
          {footNavigationList}

          {/* Colonne Newsletter */}
          <div className="flex flex-col space-y-4">
            <Typography variant="h5" className="font-bold text-gray-900 mb-2">
              Newsletter
            </Typography>
            <Typography variant="body-base" className="text-gray-600 mb-4">
              Inscrivez-vous à notre newsletter pour recevoir les dernières
              offres et actualités.
            </Typography>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors whitespace-nowrap">
                  S{"'"}abonner
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Séparateur */}
        <hr className="border-gray-200 my-8" />

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Typography variant="caption2" className="text-gray-600">
            {`Copyright © 2010 - ${currentYear} ShopiMarket. Tous droits réservés.`}
          </Typography>
          
          {/* Badges de confiance */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Avatar src="/assets/images/badge2.png" alt="Badge sécurité" />
            <Avatar src="/assets/images/badge3.png" alt="Badge qualité" />
            <Avatar src="/assets/images/badge4.png" alt="Badge livraison" />
            <Avatar src="/assets/images/badge1.png" alt="Badge paiement" />
            <Avatar src="/assets/images/Badge.jpg" alt="Badge certification" />
          </div>
        </div>
      </Container>
    </footer>
  );
}

interface footerLinkProps {
  data: FooterLink;
}

const FooterLinks = ({ data }: footerLinkProps) => {
  const linksList = data.links.map((link) => (
    <div key={uuidv4()} className="mb-2 md:mb-3">
      {link.type === LinkType.INTERNAL && (
        <ActiveLink href={link.baseUrl} className="text-gray-600 hover:text-primary transition-colors">
          {link.label}
        </ActiveLink>
      )}
      {link.type === LinkType.EXTERNAL && (
        <a
          href={link.baseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-primary transition-colors">
          {link.label}
        </a>
      )}
    </div>
  ));

  return (
    <div className="min-w-[150px] md:w-1/4">
      <Typography variant="h5" className="font-bold text-gray-900 mb-3">
        {data.label}
      </Typography>
      <div className="space-y-1">
        {linksList}
      </div>
    </div>
  );
};
