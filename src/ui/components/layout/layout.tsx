/** @format */

import React from "react";
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
export default function Layout({ children, isDisplayCreadCrumbs, sessionStatus }: Props) {
  return (
    <Session sessionStatus= {sessionStatus}>
      <Navbar />
      <Navigation />
      {isDisplayCreadCrumbs && (
        <Breadcrumbs className="absolute shadow-lg bottom-10 right-10" />
      )}
      {children}
      <Footer />
    </Session>
  );
}
