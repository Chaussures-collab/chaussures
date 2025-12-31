# Configuration Firebase pour le système de paiement

## Problème de permissions Firestore

Si vous rencontrez l'erreur `PERMISSION_DENIED: Missing or insufficient permissions`, cela signifie que les règles de sécurité Firestore ne permettent pas la création de commandes.

## Solution mise en place

Le système a été modifié pour créer les commandes **uniquement après le paiement réussi** via le webhook Stripe. Cela évite les problèmes de permissions car :

1. Le webhook s'exécute côté serveur
2. La commande est créée avec le statut `PAID` directement
3. Pas besoin de créer une commande `PENDING` avant le paiement

## Configuration des règles Firestore

### Option 1 : Utiliser le fichier `firestore.rules`

1. Copiez le contenu du fichier `firestore.rules` dans votre console Firebase
2. Allez dans Firebase Console > Firestore Database > Rules
3. Collez les règles et publiez

### Option 2 : Règles temporaires pour le développement

Pour le développement, vous pouvez utiliser des règles plus permissives (⚠️ **NE PAS utiliser en production**) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Option 3 : Utiliser Firebase Admin SDK (Recommandé pour la production)

Pour une sécurité maximale, utilisez Firebase Admin SDK côté serveur :

1. Installez le package :
```bash
npm install firebase-admin
```

2. Créez un fichier de configuration Admin :
```typescript
// src/config/firebase-admin.ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminDb = admin.firestore();
```

3. Modifiez `OrderService` pour utiliser `adminDb` au lieu de `db` quand on est côté serveur.

## Déploiement des règles

```bash
firebase deploy --only firestore:rules
```

## Vérification

Après avoir configuré les règles, testez la création d'une commande. L'erreur `PERMISSION_DENIED` ne devrait plus apparaître.


