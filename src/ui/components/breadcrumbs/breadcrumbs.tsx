/** @format */

import Typography from "@/ui/designSystem/typography/typography";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import Container from "../container/container";
import Link from "next/link";
import { IoIosArrowForward, IoMdHome } from "react-icons/io";

interface Props {
  className?: string;
  nom?: string;
}

export default function Breadcrumbs({ className, nom }: Props) {
  const router = useRouter();
  const asPath = router.asPath;
  const segments = asPath.split("/").filter(Boolean);

  // Ajouter "accueil" au début
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    ...segments.map((segment, index) => ({
      label: segment.replace(/-/g, " "),
      href: `/${segments.slice(0, index + 1).join("/")}`
    }))
  ];

  return (
    <Container
      className={clsx(
        "flex items-center gap-3 py-4 px-4 rounded-lg bg-gradient-to-r from-slate-50 to-gray-50",
        "border border-gray-100 shadow-sm",
        className
      )}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isFirst = index === 0;

        return (
          <React.Fragment key={index}>
            <Link href={item.href}>
              <div className="flex items-center gap-2 group cursor-pointer">
                {isFirst && (
                  <IoMdHome
                    className={clsx(
                      "text-lg transition-all duration-300",
                      isLast
                        ? "text-gray-800"
                        : "text-gray-400 group-hover:text-blue-500"
                    )}
                  />
                )}
                <Typography
                  variant="caption4"
                  component="span"
                  className={clsx(
                    "flex items-center transition-all duration-300 capitalize font-medium",
                    isLast
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 group-hover:text-blue-600"
                  )}>
                  {item.label}
                </Typography>
              </div>
            </Link>

            {!isLast && <IoIosArrowForward className="text-gray-300 text-sm" />}

            {nom && isLast && (
              <>
                <IoIosArrowForward className="text-gray-300 text-sm" />
                <Typography
                  variant="caption4"
                  component="span"
                  className="flex items-center text-gray-700 font-semibold capitalize">
                  {nom}
                </Typography>
              </>
            )}
          </React.Fragment>
        );
      })}
    </Container>
  );
}
