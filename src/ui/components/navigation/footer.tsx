/** @format */

import React from "react";
import Container from "../container/container";
import Typography from "@/ui/designSystem/typography/typography";
import { footerLinks } from "./app-link";
import { v4 as uuidv4 } from "uuid";
import ActiveLink from "./active-link";
import { FooterLink } from "@/types/app-links";
import { LinkType } from "@/lib/link-type";
import Avatar from "@/ui/designSystem/avatar/avatar";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Générer la liste dynamique des liens du footer
  const footNavigationList = footerLinks.map((columnLinks) => (
    <FooterLinks key={uuidv4()} data={columnLinks} />
  ));

  return (
    <div>
      <hr className="w-full border-gray-4" />
      <Container className="flex justify-between pt-4 space-y-4 max-custom:flex-wrap md:space-y-0">
        <div className="flex flex-col space-y-4 min-w-[200px] me-2 md:w-1/4">
          <Typography variant="h4" theme="black" weight="medium">
            Markets
          </Typography>
          <Typography variant="caption1" theme="gray" className="mt-2">
            Markets : votre boutique en ligne pour des produits de qualité,
            pratiques et sécurisés.
          </Typography>
        </div>
        {footNavigationList}
        <div className="flex flex-col space-y-4 min-w-[290px] md:w-1/4">
          <Typography variant="h4" theme="black" weight="medium">
            Newsletter
          </Typography>
          <div className="flex border border-primary">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-4 py-2 text-white rounded-lg bg-primary hover:bg-primary-400">
              S{"'"}abonner
            </button>
          </div>
        </div>
      </Container>

      <Container className="space-y-11 pb-2 pt-2">
        <hr className="w-full ps-2 border-gray-4" />
        <div className="flex flex-wrap items-center justify-between gap-1 text-center md:text-center">
          <Typography variant="caption1" theme="gray">
            {`Copyright © 2010 - ${currentYear}`}
          </Typography>
        <div className="flex items-center justify-center">
          <Avatar
            src="/assets/images/badge2.png"
            alt="Logo"/>
          <Avatar
            src="/assets/images/badge3.png"
            alt="Logo"/>
          <Avatar
            src="/assets/images/badge4.png"
            alt="Logo" />
          <Avatar
            src="/assets/images/badge1.png"
            alt="Logo"/>
          <Avatar
            src="/assets/images/Badge.jpg"
            alt="Logo"/>
        </div>
        </div>
      </Container>
    </div>
  );
}

interface footerLinkProps {
  data: FooterLink;
}

const FooterLinks = ({ data }: footerLinkProps) => {
  const linksList = data.links.map((link) => (
    <div key={uuidv4()} className="mb-2 md:mb-8 grid-row">
      {link.type === LinkType.INTERNAL && (
        <ActiveLink href={link.baseUrl}>{link.label}</ActiveLink>
      )}
      {link.type === LinkType.EXTERNAL && (
        <a href={link.baseUrl} target="_blank" rel="noopener noreferrer">
          {link.label}
        </a>
      )}
    </div>
  ));

  return (
    <div className="min-w-[150px] md:w-1/4">
      <Typography theme="gray" variant="h4" weight="medium" className="pb-1">
        {data.label}
      </Typography>
      <Typography theme="black" variant="caption1" className="">
        {linksList}
      </Typography>
    </div>
  );
};
