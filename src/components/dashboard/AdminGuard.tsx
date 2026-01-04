/** @format */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthUserContext";
import { auth } from "@/config/firebase-config";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { authUser, authUserIsLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (authUserIsLoading) return;

      if (!authUser) {
        router.push("/login?redirect=/dashboard");
        return;
      }

      try {
        // Récupérer le token ID
        const idToken = await auth.currentUser?.getIdTokenResult();
        
        // Vérifier si l'utilisateur a le claim admin
        const adminClaim = idToken?.claims.admin === true || idToken?.claims.role === "admin";
        
        // Alternative: vérifier dans le document utilisateur Firestore
        const userDoc = authUser.userDocument;
        const adminFromDoc = (userDoc?.admin === true || userDoc?.role === "admin") ||
          (userDoc?.userDocData?.admin === true || userDoc?.userDocData?.role === "admin");

        if (adminClaim || adminFromDoc) {
          setIsAdmin(true);
        } else {
          router.push("/shop");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification admin:", error);
        // router.push("/shop");
      } finally {
        setIsChecking(false);
      }
    };

    checkAdmin();
  }, [authUser, authUserIsLoading, router]);

  if (authUserIsLoading || isChecking) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
        <Typography variant="body" className="text-gray-600">
          Vérification des permissions...
        </Typography>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <Typography variant="h2" className="mb-4 font-bold text-gray-900">
          Accès refusé
        </Typography>
        <Typography variant="body" className="mb-6 text-center text-gray-600">
          Vous n&apos;avez pas les permissions nécessaires pour accéder au dashboard.
        </Typography>
        <Button action={() => router.push("/shop")} variant="accent">
          Retour à la boutique
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
