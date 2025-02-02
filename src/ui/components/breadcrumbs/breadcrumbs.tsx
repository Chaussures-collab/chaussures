/** @format */

import Typography from "@/ui/designSystem/typography/typography";
import clsx from "clsx";
import { useRouter } from "next/router";
import React from "react";
import Container from "../container/container";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
interface Props {
  className?: string;
  nom?: string;
}

export default function Breadcrumbs({ className, nom }: Props) {
  const router = useRouter();
  const asPath = router.asPath;
  const segments = asPath.split("/");
  const lastSegment = segments[segments.length - 1];
  segments[0] = "accueil";
  const view = segments.map((segment, index) => (
  <div key={index} className="mt-5 items-center">
    <Link href={index > 0 ? `/${segments.slice(1, index + 1).join("/")}` : "/"}>
      <Typography
        variant="caption4"
        component="span"
        className={clsx(
          segment !== lastSegment ? "text-gray-600" : "text-gray",
          "capitalize hover:text-gray animate"
        )}
      >
        {segment === "accueil" ? (<span className="mt-10 capitalize">Accueil</span>) : segment.replace(/-/g, " ")}
      </Typography>
      {segment !== lastSegment && (
        <IoIosArrowForward className="inline-block mb-1 ml-2" />
      )}
    </Link>
    {nom && index === segments.length - 1 && (
      <span className="ml-2 text-2xl">| {nom}</span>
    )}
  </div>
));
  return (
    <Container className={clsx("flex items-center gap-1", className)}>
      {view}
    </Container>
  );
}
