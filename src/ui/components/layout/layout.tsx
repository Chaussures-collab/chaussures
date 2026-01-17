/** @format */

"use client";

import React from "react";
import { useRouter } from "next/router";
import Navigation from "../navigation/navigation";
import Footer from "../navigation/footer";
import Breadcrumbs from "../breadcrumbs/breadcrumbs";
import Navbar from "../navigation/navbar";
import Session from "../session/session";
import { SessionStatusTypes } from "@/types/sessionStatusTypes";

interface Props {
  children: React.ReactNode;
  isDisplayCreadCrumbs?: boolean;
  sessionStatus?: SessionStatusTypes;
}

export default function Layout({
  children,
  isDisplayCreadCrumbs,
  sessionStatus
}: Props) {
  const router = useRouter();
  const pathname = router.pathname; // string
  const isDashboard = pathname.includes("dashboard");

  return (
    <Session sessionStatus={sessionStatus}>
      {!isDashboard && <Navbar />}
      {!isDashboard && <Navigation />}

      {isDisplayCreadCrumbs && !isDashboard && (
        <Breadcrumbs className="absolute shadow-lg bottom-10 right-10" />
      )}

      {children}

      {!isDashboard && <Footer />}
    </Session>
  );
}
