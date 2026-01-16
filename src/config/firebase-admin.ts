/** @format */

import admin from "firebase-admin";

let isInitialized = false;

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
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replaceAll(
            String.raw`\n`,
            "\n"
          )
        })
      });
      console.log(
        "✅ Firebase Admin SDK initialisé avec credentials personnalisés"
      );
      isInitialized = true;
    } else {
      // Option 2 : Utiliser Application Default Credentials
      // Pour le développement local, vous pouvez utiliser le service account key
      // Téléchargez-le depuis Firebase Console > Project Settings > Service Accounts
      try {
        admin.initializeApp({
          projectId:
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "shobmarket-341da"
        });
        console.log(
          "✅ Firebase Admin SDK initialisé avec Application Default Credentials"
        );
        isInitialized = true;
      } catch (error) {
        console.warn(
          "⚠️ Firebase Admin SDK: Initialisation partielle - certaines fonctionnalités peuvent être limitées",
          error
        );
        // Essayer une initialisation minimale
        try {
          if (!admin.apps.length) {
            admin.initializeApp({
              projectId: "shobmarket-341da"
            });
            isInitialized = true;
          }
        } catch {
          // Silently fail - on peut continuer sans Firebase complet en développement
          isInitialized = false;
        }
      }
    }
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'initialisation de Firebase Admin:",
      error
    );
    // En cas d'erreur, essayer quand même avec le projectId
    try {
      if (!admin.apps.length) {
        admin.initializeApp({
          projectId: "shobmarket-341da"
        });
        isInitialized = true;
      }
    } catch (fallbackError) {
      console.error(
        "❌ Impossible d'initialiser Firebase Admin SDK:",
        fallbackError
      );
      isInitialized = false;
    }
  }
}

// Exporter avec vérification de disponibilité
// Initialiser avec null pour éviter les erreurs TypeScript
let adminDb: admin.firestore.Firestore | null = null;
let adminAuth: admin.auth.Auth | null = null;
let adminTimestamp: typeof admin.firestore.Timestamp | null = null;

if (admin.apps.length > 0) {
  try {
    adminDb = admin.firestore();
    adminAuth = admin.auth();
    adminTimestamp = admin.firestore.Timestamp;
    isInitialized = true;
  } catch (error) {
    console.warn("⚠️ Impossible d'initialiser adminDb ou adminAuth:", error);
    isInitialized = false;
  }
}

// Fonction helper pour asserter que adminDb n'est pas null
function getAdminDb(): admin.firestore.Firestore {
  if (!adminDb) {
    throw new Error(
      "adminDb n'est pas initialisé. Vérifiez la configuration Firebase Admin SDK."
    );
  }
  return adminDb;
}

// Fonction helper pour asserter que adminTimestamp n'est pas null
function getAdminTimestamp(): typeof admin.firestore.Timestamp {
  if (!adminTimestamp) {
    throw new Error(
      "Firebase Timestamp n'est pas disponible. Vérifiez l'initialisation de Firebase Admin SDK."
    );
  }
  return adminTimestamp;
}

export {
  adminDb,
  adminAuth,
  adminTimestamp,
  isInitialized,
  getAdminDb,
  getAdminTimestamp
};

