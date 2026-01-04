/** @format */

import { UserInterface } from "@/types/userTypes";
import { auth } from "@/config/firebase-config";

/**
 * Vérifie si l'utilisateur est admin
 * @param authUser - L'utilisateur authentifié
 * @returns true si l'utilisateur est admin, false sinon
 */
export async function isAdmin(authUser: UserInterface | null): Promise<boolean> {
  if (!authUser) return false;

  try {
    // Vérifier les claims Firebase
    const idToken = await auth.currentUser?.getIdTokenResult();
    const adminClaim = idToken?.claims.admin === true || idToken?.claims.role === "admin";

    // Vérifier dans le document Firestore
    const userDoc = authUser.userDocument;
    const adminFromDoc = 
      userDoc?.admin === true || 
      userDoc?.role === "admin" ||
      userDoc?.userDocData?.admin === true || 
      userDoc?.userDocData?.role === "admin";

    return adminClaim || adminFromDoc || false;
  } catch (error) {
    console.error("Erreur lors de la vérification admin:", error);
    return false;
  }
}
