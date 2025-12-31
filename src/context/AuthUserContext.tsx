/** @format */

import useFirebaseAuth from "@/hooks/use-firebase-auth";
import {  UserInterface } from "@/types/userTypes";
import React, { createContext, useContext } from "react";


interface Props {
  children: React.ReactNode;
}
interface AuthContextType {
  authUser: UserInterface | null;
  authUserIsLoading: boolean;
}

const authUserContext = createContext<AuthContextType>({
  authUser: null,
  authUserIsLoading: true
});

export default function AuthUserProvider({ children }: Props) {
  const { authUser, authUserIsLoading } = useFirebaseAuth();

  return (
    <authUserContext.Provider value={{ authUser, authUserIsLoading }}>
      {children}
    </authUserContext.Provider>
  );
}


export const useAuth = () => useContext(authUserContext);
