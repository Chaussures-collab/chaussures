import { auth } from "@/config/firebase-config";
import { UserDocument, UserInterface } from "@/types/userTypes";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { db } from "@/config/firebase-config";

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<UserInterface | null>(null);
  const [authUserIsLoading, setAuthUserIsLoading] = useState<boolean>(true);

  // Formatter l'objet utilisateur
  const formatAuthUser = useCallback((user: UserInterface) => ({
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL,
  }), []);

  // Récupérer le document utilisateur Firestore
  const getUserDocument = useCallback(async (user: UserInterface) => {
    if (!auth.currentUser) return;

    const documentRef = doc(db, "users", auth.currentUser.uid);
    const compactUser = { ...user };

    const unsubscribe = onSnapshot(documentRef, async (doc) => {
      if (doc.exists()) {
        compactUser.userDocument = doc.data() as UserDocument;
      }
      setAuthUser((prevAuthUser) => ({
        ...prevAuthUser,
        ...compactUser,
      }));
      setAuthUserIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Gérer les changements de statut d'authentification
  const authStateChanged = useCallback(async (authState: UserInterface | User | null) => {
    if (!authState) {
      setAuthUser(null);
      setAuthUserIsLoading(false);
      return;
    }

    setAuthUserIsLoading(true);
    const formattedUser = formatAuthUser(authState as UserInterface);
    await getUserDocument(formattedUser);
  }, [formatAuthUser, getUserDocument]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribeAuth(); // Nettoyage de l'abonnement Firebase Auth
  }, [authStateChanged]);

  return {
    authUser,
    authUserIsLoading,
  };
}
