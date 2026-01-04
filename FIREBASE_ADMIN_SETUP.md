# Configuration Firebase Admin SDK pour le Seeding

## 📋 Problème

L'API route `/api/seed-data` s'exécute côté serveur et n'a pas accès au token d'authentification de l'utilisateur. Les règles Firestore exigent une authentification, ce qui cause des erreurs `PERMISSION_DENIED`.

## ✅ Solution

Utilisation de **Firebase Admin SDK** qui contourne les règles de sécurité Firestore et permet d'écrire directement dans la base de données depuis le serveur.

## 🔧 Configuration

### Option 1 : Service Account Key (Recommandé pour la production)

1. **Télécharger le Service Account Key** :
   - Allez dans [Firebase Console](https://console.firebase.google.com/)
   - Sélectionnez votre projet : `shobmarket-341da`
   - Allez dans **Project Settings** → **Service Accounts**
   - Cliquez sur **Generate New Private Key**
   - Téléchargez le fichier JSON

2. **Configurer les variables d'environnement** :
   
   Ouvrez le fichier JSON téléchargé et ajoutez dans votre `.env.local` :
   
   ```env
   FIREBASE_PROJECT_ID=shobmarket-341da
   FIREBASE_CLIENT_EMAIL=votre-client-email@shobmarket-341da.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
   ```
   
   ⚠️ **Important** : 
   - Gardez le fichier JSON en sécurité (ne le commitez jamais)
   - La clé privée doit être sur une seule ligne avec `\n` pour les retours à la ligne

### Option 2 : Application Default Credentials (Pour GCP/Cloud)

Si vous déployez sur Google Cloud Platform, les credentials sont automatiquement détectés.

### Option 3 : Développement local (Sans credentials)

Pour le développement local, Firebase Admin SDK peut s'initialiser avec juste le `projectId`. Cependant, cela peut ne pas fonctionner selon votre configuration.

## 🚀 Utilisation

Une fois configuré, le seeding fonctionnera automatiquement :

1. Accédez au dashboard : `/dashboard`
2. Cliquez sur **"Importer les données mockées"**
3. Les données seront importées via Firebase Admin SDK (contourne les règles)

## 🔒 Sécurité

- ⚠️ **Firebase Admin SDK contourne toutes les règles de sécurité Firestore**
- ✅ Utilisez-le uniquement côté serveur (API routes)
- ✅ Ne l'exposez jamais au client
- ✅ Protégez vos credentials (variables d'environnement)

## 📝 Fichiers créés

- `src/config/firebase-admin.ts` : Configuration Admin SDK
- `src/services/dashboard/AdminProductService.ts` : Service Admin pour produits
- `src/services/dashboard/AdminCategoryService.ts` : Service Admin pour catégories
- `src/pages/api/seed-data.ts` : Utilise maintenant les services Admin

## 🐛 Dépannage

### Erreur "Failed to initialize Firebase Admin"

**Solution** : Vérifiez que les variables d'environnement sont correctement configurées :
```bash
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
```

### Erreur "Permission denied" persiste

**Solution** : Vérifiez que vous utilisez bien les services Admin (`AdminProductService`, `AdminCategoryService`) et non les services normaux.

### Erreur "Cannot find module 'firebase-admin'"

**Solution** : Installez le package :
```bash
npm install firebase-admin
```

