/** @format */

import { useAuth } from "@/context/AuthUserContext";
import { GUEST, REGISTERED } from "@/lib/session-status";
import { SessionStatusTypes } from "@/types/sessionStatusTypes";
import SpinnerScreen from "@/ui/designSystem/spinner/spinner-screen";
import { useRouter } from "next/router";
import React from "react";
interface Props {
  children: React.ReactNode;
  sessionStatus?: SessionStatusTypes;
}

export default function Session({ children, sessionStatus }: Props) {
  const route = useRouter();
  const { authUserIsLoading, authUser } = useAuth();

  if( sessionStatus === GUEST && !authUserIsLoading ) {
    if (!authUser) {
      return <>{children}</>;
    }else {
      route.push("/profil");
    }
  }
  if( sessionStatus === REGISTERED && !authUserIsLoading ) {
    if (authUser) {
      return <>{children}</>;
    }else {
      route.push("/connexion");
    }
  }
  if (!sessionStatus && !authUserIsLoading) {
    return <>{children}</>;
  }
  return <SpinnerScreen />;
}
