/** @format */

import admin from "firebase-admin";

// Initialiser Firebase Admin SDK uniquement si ce n'est pas déjà fait
if (!admin.apps.length) {
  try {
    // Option 1 : Utiliser les credentials depuis les variables d'environnement
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        })
      });
      console.log("✅ Firebase Admin SDK initialisé avec credentials personnalisés");
    } else {
      // Option 2 : Utiliser Application Default Credentials
      // Pour le développement local, vous pouvez utiliser le service account key
      // Téléchargez-le depuis Firebase Console > Project Settings > Service Accounts
      try {
        admin.initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shobmarket-341da"
        });
        console.log("✅ Firebase Admin SDK initialisé avec Application Default Credentials");
      } catch {
        // Option 3 : En développement, utiliser les credentials du client Firebase
        // Note: Cette approche contourne les règles de sécurité
        console.warn("⚠️ Firebase Admin SDK: Utilisation de l'initialisation par défaut");
        admin.initializeApp({
          projectId: "shobmarket-341da"
        });
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de Firebase Admin:", error);
    // En cas d'erreur, essayer quand même avec le projectId
    try {
      admin.initializeApp({
        projectId: "shobmarket-341da"
      });
    } catch (fallbackError) {
      console.error("❌ Impossible d'initialiser Firebase Admin SDK:", fallbackError);
    }
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

