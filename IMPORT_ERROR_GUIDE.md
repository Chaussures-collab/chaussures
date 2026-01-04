# Guide de résolution de l'erreur "Right-hand side of 'instanceof' is not an object"

## Problème

L'erreur "Right-hand side of 'instanceof' is not an object" se produit lors de l'importation des données. Cette erreur vient généralement de Firebase Admin SDK qui n'est pas correctement initialisé.

## Solutions

### Solution 1 : Vérifier les variables d'environnement

Assurez-vous que les variables d'environnement suivantes sont définies dans votre fichier `.env.local` :

```env
FIREBASE_PROJECT_ID=shobmarket-341da
FIREBASE_CLIENT_EMAIL=votre-client-email@shobmarket-341da.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
```

**Pour obtenir ces credentials :**
1. Allez dans [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet : `shobmarket-341da`
3. Allez dans **Project Settings** → **Service Accounts**
4. Cliquez sur **Generate New Private Key**
5. Téléchargez le fichier JSON
6. Extrayez les valeurs du JSON et ajoutez-les dans `.env.local`

### Solution 2 : Redémarrer le serveur Next.js

Après avoir modifié les variables d'environnement :
1. Arrêtez le serveur (Ctrl+C)
2. Redémarrez avec `npm run dev`
3. Réessayez l'importation

### Solution 3 : Utiliser le client Firebase au lieu d'Admin SDK (temporaire)

Si le problème persiste, vous pouvez temporairement utiliser le client Firebase normal (qui utilise les règles Firestore) au lieu de l'Admin SDK.

## Commandes utiles

### Vérifier que le serveur est en cours d'exécution

```powershell
# Dans PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/import-data" -Method POST -ContentType "application/json" -Body "{}"
```

### Voir les logs du serveur

Les logs du serveur Next.js afficheront des messages comme :
- `✅ Firebase Admin SDK initialisé avec credentials personnalisés`
- `❌ Erreur lors de l'initialisation de Firebase Admin: ...`

Si vous voyez des erreurs dans les logs, cela confirmera que le problème vient de l'initialisation.

