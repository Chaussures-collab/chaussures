/** @format */

import Typography from "@/ui/designSystem/typography/typography";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Container from "../container/container";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { HiChevronRight } from "react-icons/hi";

interface Props {
  className?: string;
  nom?: string;
}

// Mapping des labels pour des noms plus lisibles
const labelMapping: Record<string, string> = {
  shop: "Boutique",
  contact: "Contact",
  cart: "Panier",
  profil: "Mon Profil",
  connexion: "Connexion",
  inscription: "Inscription",
  "detail-produit": "Détail Produit",
  dashboard: "Tableau de bord",
  commande: "Commande"
};

export default function Breadcrumbs({ className, nom }: Props) {
  const router = useRouter();
  const asPath = router.asPath;
  const [isMobile, setIsMobile] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Nettoyer le path (enlever les query params)
  const cleanPath = asPath.split("?")[0];
  const segments = cleanPath.split("/").filter(Boolean);

  // Créer les items du breadcrumb avec labels améliorés
  const breadcrumbItems = [
    { label: "Accueil", href: "/", icon: true },
    ...segments.map((segment, index) => {
      const cleanSegment = segment.replace(/-/g, " ");
      const label = labelMapping[segment] || cleanSegment;
      return {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href: `/${segments.slice(0, index + 1).join("/")}`,
        icon: false
      };
    })
  ];

  // Sur mobile, limiter l'affichage si trop d'éléments
  const displayItems =
    isMobile && breadcrumbItems.length > 3 ?
      [
        breadcrumbItems[0], // Accueil
        { label: "...", href: "#", icon: false, isEllipsis: true },
        ...breadcrumbItems.slice(-2) // 2 derniers éléments
      ]
    : breadcrumbItems;

  // Extraire les classes de background du className personnalisé
  // const hasCustomBg = className?.includes("bg-");

  return (
    <nav aria-label="Breadcrumb" className={clsx("w-full", className)}>
      <Container
        className={clsx(
          "flex items-center gap-2 sm:gap-3 py-2",
          "rounded-lg sm:rounded-xl",
          "backdrop-blur-sm",
          "overflow-x-auto", // Scroll horizontal sur mobile si nécessaire
          "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        )}>
        <ol className="flex gap-2 items-center min-w-max sm:gap-3">
          {displayItems.map((item, index) => {
            const isLast = index === displayItems.length - 1;
            const isFirst = index === 0;
            const isEllipsis =
              "isEllipsis" in item &&
              (item as { isEllipsis?: boolean }).isEllipsis;

            return (
              <li
                key={`${item.href}-${index}`}
                className="flex flex-shrink-0 gap-2 items-center sm:gap-3">
                {!isFirst && (
                  <HiChevronRight
                    className="flex-shrink-0 text-xs text-gray-400 sm:text-sm"
                    aria-hidden="true"
                  />
                )}

                {isEllipsis ?
                  <span
                    className="px-1 text-sm text-gray-400 sm:text-base"
                    aria-hidden="true">
                    ...
                  </span>
                : <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-1.5 sm:gap-2",
                      "transition-all duration-200 ease-in-out",
                      "rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5",
                      "group",
                      isLast ?
                        "pointer-events-none" // Désactiver le clic sur le dernier élément
                      : "hover:bg-gray-100 active:bg-gray-200"
                    )}
                    aria-current={isLast ? "page" : undefined}>
                    {item.icon && (
                      <IoMdHome
                        className={clsx(
                          "flex-shrink-0 text-base transition-colors duration-200 sm:text-lg",
                          isLast ? "text-gray-700" : (
                            "text-gray-500 group-hover:text-primary"
                          )
                        )}
                        aria-hidden="true"
                      />
                    )}
                    <Typography
                      variant="caption2"
                      component="span"
                      className={clsx(
                        "whitespace-nowrap",
                        "transition-all duration-200",
                        "text-xs sm:text-sm md:text-base",
                        isLast ?
                          "font-semibold text-gray-900"
                        : "font-medium text-gray-600 group-hover:text-primary"
                      )}>
                      {item.label}
                    </Typography>
                  </Link>
                }

                {nom && isLast && (
                  <>
                    <HiChevronRight
                      className="flex-shrink-0 text-xs text-gray-400 sm:text-sm"
                      aria-hidden="true"
                    />
                    <Typography
                      variant="caption2"
                      component="span"
                      className="flex items-center text-xs font-semibold text-gray-900 capitalize whitespace-nowrap sm:text-sm md:text-base">
                      {nom}
                    </Typography>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </nav>
  );
}
