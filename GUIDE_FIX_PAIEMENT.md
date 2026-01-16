# 🔧 Guide de Correction du Système de Paiement

## 🎯 Problème Principal Identifié

Le système de paiement fonctionne jusqu'à la confirmation, mais **les commandes ne sont pas créées** car le webhook Stripe ne déclenche pas correctement le traitement, OU les services Admin Firebase ne fonctionnent pas.

## 📝 Solution Étape par Étape

### ÉTAPE 1 : Vérifier la Configuration du Webhook (CRITIQUE)

#### En Développement Local :

1. **Installer Stripe CLI** :
   ```bash
   # Windows (avec Scoop)
   scoop install stripe

   # Ou télécharger depuis https://stripe.com/docs/stripe-cli
   ```

2. **Connecter Stripe CLI à votre compte** :
   ```bash
   stripe login
   ```

3. **Lancer le listener de webhook** :
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copier le "Signing secret" affiché** (commence par `whsec_`)

5. **Ajouter dans `.env.local`** :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
   ```

#### En Production :

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **"Add endpoint"**
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Sélectionnez l'événement : **`payment_intent.succeeded`**
5. Copiez le **"Signing secret"**
6. Ajoutez dans vos variables d'environnement (Vercel, Netlify, etc.)

### ÉTAPE 2 : Configurer Firebase Admin SDK (CRITIQUE)

1. **Télécharger le Service Account Key** :
   - Allez sur https://console.firebase.google.com/
   - Sélectionnez votre projet `shobmarket-341da`
   - Allez dans **Project Settings** → **Service Accounts**
   - Cliquez sur **"Generate New Private Key"**
   - Téléchargez le fichier JSON

2. **Extraire les valeurs** du fichier JSON :
   ```json
   {
     "project_id": "shobmarket-341da",
     "client_email": "firebase-adminsdk-xxxxx@shobmarket-341da.iam.gserviceaccount.com",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   }
   ```

3. **Ajouter dans `.env.local`** :
   ```env
   FIREBASE_PROJECT_ID=shobmarket-341da
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@shobmarket-341da.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée complète ici\n-----END PRIVATE KEY-----\n"
   ```

   ⚠️ **IMPORTANT** :
   - La clé privée doit être sur **une seule ligne**
   - Les retours à la ligne doivent être représentés par `\n`
   - La clé doit être entre guillemets doubles `"`

### ÉTAPE 3 : Tester le Système

1. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Vérifier les logs au démarrage** :
   - Vous devriez voir : `✅ Firebase Admin SDK initialisé avec credentials personnalisés`
   - Si vous voyez : `⚠️ Firebase Admin SDK: Utilisation de l'initialisation par défaut`
     → Les credentials ne sont pas correctement configurés

3. **Effectuer un paiement test** :
   - Utilisez la carte de test Stripe : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : n'importe quel 3 chiffres

4. **Vérifier les logs serveur** :
   - Cherchez : `🔵 [Webhook] Event type: payment_intent.succeeded`
   - Cherchez : `✅ [Webhook] adminDb est initialisé`
   - Cherchez : `🔵 [PaymentManager] handlePaymentWebhook appelé`
   - Cherchez : `✅ [AdminOrderService] Commande créée avec l'ID : ...`

### ÉTAPE 4 : Déboguer les Erreurs

#### Si vous ne voyez AUCUN log `🔵 [Webhook]` :
→ **Le webhook n'est pas reçu**
- Vérifiez que Stripe CLI est lancé (en local)
- Vérifiez que le webhook est configuré (en production)
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct

#### Si vous voyez `❌ [Webhook] userId manquant` :
→ **Les métadonnées ne sont pas passées correctement**
- Vérifiez que `itemsJson` est dans les métadonnées du Payment Intent
- Vérifiez la taille des métadonnées (limite Stripe : 500 caractères par clé)

#### Si vous voyez `❌ [AdminOrderService] adminDb n'est pas initialisé` :
→ **Firebase Admin SDK n'est pas initialisé**
- Vérifiez les variables d'environnement
- Vérifiez le format de `FIREBASE_PRIVATE_KEY` (doit avoir `\n` pour les retours à la ligne)

#### Si vous voyez `❌ [AdminOrderService] Code d'erreur: PERMISSION_DENIED` :
→ **Firebase Admin SDK ne contourne pas les règles**
- Vérifiez que `adminDb` est bien utilisé (pas `db`)
- Vérifiez que les credentials sont corrects

### ÉTAPE 5 : Vérifier dans Firestore

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet
3. Allez dans **Firestore Database**
4. Vérifiez la collection `orders`
5. Vous devriez voir une nouvelle commande avec :
   - `status: "PAID"`
   - `items: [...]`
   - `userId: "..."`
   - `totalAmount: ...`

## 🔍 Commandes de Diagnostic

```bash
# Tester le système de paiement
node scripts/test-payment-system.js

# Lancer Stripe CLI (en local)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Tester un webhook manuellement (avec Stripe CLI)
stripe trigger payment_intent.succeeded
```

## ✅ Checklist de Vérification

- [ ] `STRIPE_WEBHOOK_SECRET` configuré et testé
- [ ] `FIREBASE_PROJECT_ID` configuré
- [ ] `FIREBASE_CLIENT_EMAIL` configuré
- [ ] `FIREBASE_PRIVATE_KEY` configuré (format correct avec `\n`)
- [ ] Firebase Admin SDK initialisé (vérifié dans les logs)
- [ ] Webhook configuré dans Stripe Dashboard (ou Stripe CLI lancé en local)
- [ ] Logs `🔵 [Webhook]` apparaissent lors d'un paiement test
- [ ] Logs `✅ [AdminOrderService]` apparaissent lors d'un paiement test
- [ ] Commande créée dans Firestore après un paiement test

## 📞 Si le Problème Persiste

1. **Partagez les logs complets** du serveur lors d'un paiement test
2. **Vérifiez** que toutes les variables d'environnement sont présentes
3. **Testez manuellement** le webhook avec Stripe CLI
4. **Vérifiez** que Firebase Admin SDK peut écrire dans Firestore (testez avec un script simple)

