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
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Effets de fond */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-dark rounded-full blur-3xl"></div>
      </div>

      <Container className="relative z-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Colonne 1: À propos */}
          <div className="flex flex-col space-y-6">
            <div>
              <Typography variant="h3" className="font-bold text-white mb-3 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                SnipersMarket
              </Typography>
              <Typography variant="body-base" className="text-gray-300 leading-relaxed">
                Votre boutique en ligne pour des produits de qualité, pratiques et
                sécurisés. Nous nous engageons à vous offrir la meilleure expérience d{"'"}achat.
              </Typography>
            </div>
            {/* Réseaux sociaux */}
            <div className="flex gap-3">
              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-primary hover:border-primary hover:scale-110 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-primary/50">
                <FiFacebook size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-primary hover:border-primary hover:scale-110 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-primary/50">
                <FiTwitter size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-primary hover:border-primary hover:scale-110 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-primary/50">
                <FiInstagram size={20} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="group w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-primary hover:border-primary hover:scale-110 text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-primary/50">
                <FiLinkedin size={20} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Colonnes de liens */}
          {footNavigationList}

          {/* Colonne Newsletter */}
          <div className="flex flex-col space-y-5">
            <div>
              <Typography variant="h5" className="font-bold text-white mb-3">
                Newsletter
              </Typography>
              <Typography variant="body-base" className="text-gray-300 leading-relaxed">
                Recevez nos dernières offres exclusives et actualités directement dans votre boîte mail.
              </Typography>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform">
                S{"'"}abonner
              </button>
            </form>
            <Typography variant="caption1" className="text-gray-400 text-xs">
              🔒 Vos données sont protégées. Désabonnez-vous à tout moment.
            </Typography>
          </div>
        </div>

        {/* Séparateur avec effet */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-4 text-gray-400 text-sm">SnipersMarket</span>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Typography variant="caption2" className="text-gray-400 text-center md:text-left">
            {`Copyright © 2010 - ${currentYear} SnipersMarket. Tous droits réservés.`}
          </Typography>
          
          {/* Badges de confiance */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <div className="group relative">
              <Avatar 
                src="/assets/images/badge2.png" 
                alt="Badge sécurité"
                className="opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer transform group-hover:scale-110 duration-300"
              />
            </div>
            <div className="group relative">
              <Avatar 
                src="/assets/images/badge3.png" 
                alt="Badge qualité"
                className="opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer transform group-hover:scale-110 duration-300"
              />
            </div>
            <div className="group relative">
              <Avatar 
                src="/assets/images/badge4.png" 
                alt="Badge livraison"
                className="opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer transform group-hover:scale-110 duration-300"
              />
            </div>
            <div className="group relative">
              <Avatar 
                src="/assets/images/badge1.png" 
                alt="Badge paiement"
                className="opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer transform group-hover:scale-110 duration-300"
              />
            </div>
            <div className="group relative">
              <Avatar 
                src="/assets/images/Badge.jpg" 
                alt="Badge certification"
                className="opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer transform group-hover:scale-110 duration-300"
              />
            </div>
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
    <div key={uuidv4()} className="mb-3">
      {link.type === LinkType.INTERNAL && (
        <ActiveLink 
          href={link.baseUrl} 
          className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block group">
          <span className="group-hover:underline">{link.label}</span>
        </ActiveLink>
      )}
      {link.type === LinkType.EXTERNAL && (
        <a
          href={link.baseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-300 hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block group">
          <span className="group-hover:underline">{link.label}</span>
        </a>
      )}
    </div>
  ));

  return (
    <div className="min-w-[150px]">
      <Typography variant="h5" className="font-bold text-white mb-5">
        {data.label}
      </Typography>
      <div className="space-y-2">
        {linksList}
      </div>
    </div>
  );
};
