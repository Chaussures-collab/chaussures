import { AppLinks,FooterLink } from "@/types/app-links";

export const footerApplicationLinks: AppLinks[] = [
  {
    label: "Option de payement",
    baseUrl: "https://www.paypal.com",
    type: "external"
  },
  {
    label: "Service client",
    baseUrl: "/contact",
    type: "internal"
  },
  {
    label: "F.A.Q",
    baseUrl: "/#",
    type: "internal"
  },
  {
    label: "Politique de protection des données",
    baseUrl: "/#",
    type: "internal"
  }
];
export const footerApplicationUsers: AppLinks[] = [
  {
    label: "Mon espace",
    baseUrl: "/",
    type: "internal"
  },
  {
    label: "Shop",
    baseUrl: "/shop",
    type: "internal"
  },
  {
    label: "Nouveaux arrivants",
    baseUrl: "/nouveaux-arrivants",
    type: "internal"
  },
  {
    label: "Contact",
    baseUrl: "/contact",
    type: "internal"
  }
];

export const footerLinks: FooterLink[] = [
  {
    label: "Utilisateurs",
    links: footerApplicationUsers
  },
  {
    label: "Aide",
    links: footerApplicationLinks
  }
];