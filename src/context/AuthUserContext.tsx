/** @format */

import useFirebaseAuth from "@/hooks/use-firebase-auth";
import { UserDocument } from "@/types/userTypes";
import React, { createContext, useContext } from "react";

const init = {
  uid: "",
  email: "",
  nom: "",
  prenom: "",
  photoURL: "",
  emailVerified: false,
  phoneNumber: "",
  userDocument: {} as UserDocument
};

const authUserContext = createContext({
  authUser: init,
  authUserIsLoading: true
});
interface Props {
  children: React.ReactNode;
}
export default function AuthUserProvider({ children }: Props) {
  const auth = useFirebaseAuth();

  return (
    <authUserContext.Provider
      value={{
        authUser: auth.authUser as {
          uid: string;
          email: string;
          nom: string;
          prenom: string;
          emailVerified: boolean;
          phoneNumber: string;
          photoURL: string;
          userDocument: UserDocument;
        },
        authUserIsLoading: auth.authUserIsLoading
      }}
    >
      {children}
    </authUserContext.Provider>
  );
}

export const useAuth = () => useContext(authUserContext);
