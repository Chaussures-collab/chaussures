# 🔧 Configuration des Variables d'Environnement

## 🎯 Variables Critiques Manquantes

D'après le diagnostic, vous devez configurer ces variables dans `.env.local` :

### 1. ⚠️ STRIPE_WEBHOOK_SECRET (CRITIQUE - Sans ça, les webhooks ne fonctionnent pas)

#### En Développement Local :

1. **Installer Stripe CLI** :
   ```powershell
   # Avec Scoop (si installé)
   scoop install stripe
   
   # Ou télécharger depuis : https://stripe.com/docs/stripe-cli
   ```

2. **Connecter Stripe CLI** :
   ```powershell
   stripe login
   ```

3. **Lancer le listener** (dans un terminal séparé) :
   ```powershell
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copier le "Signing secret"** affiché (commence par `whsec_`)

5. **Ajouter dans `.env.local`** :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_votre_secret_ici
   ```

#### En Production :

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez sur **"Add endpoint"**
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Événement : **`payment_intent.succeeded`**
5. Copiez le **"Signing secret"**
6. Ajoutez-le dans vos variables d'environnement (Vercel, Netlify, etc.)

---

### 2. 🔑 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (Pour le frontend)

1. Allez sur https://dashboard.stripe.com/apikeys
2. Copiez la **"Publishable key"** (commence par `pk_test_` ou `pk_live_`)
3. Ajoutez dans `.env.local` :
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

---

### 3. 🔐 STRIPE_SECRET_KEY (Pour le backend)

1. Allez sur https://dashboard.stripe.com/apikeys
2. Copiez la **"Secret key"** (commence par `sk_test_` ou `sk_live_`)
3. ⚠️ **Ne la partagez JAMAIS publiquement**
4. Ajoutez dans `.env.local` :
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```

---

### 4. 🔥 FIREBASE_PROJECT_ID (Pour Firebase Admin SDK)

**Valeur** : `shobmarket-341da` (déjà connu)

```env
FIREBASE_PROJECT_ID=shobmarket-341da
```

---

### 5. 📧 FIREBASE_CLIENT_EMAIL (Pour Firebase Admin SDK)

1. Allez sur https://console.firebase.google.com/project/shobmarket-341da/settings/serviceaccounts/adminsdk
2. Cliquez sur **"Generate New Private Key"**
3. Téléchargez le fichier JSON
4. Ouvrez le fichier JSON et copiez la valeur de `client_email`
5. Ajoutez dans `.env.local` :
   ```env
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@shobmarket-341da.iam.gserviceaccount.com
   ```

---

### 6. 🔐 FIREBASE_PRIVATE_KEY (Pour Firebase Admin SDK)

1. Dans le même fichier JSON téléchargé, copiez la valeur de `private_key`
2. ⚠️ **IMPORTANT** : La clé doit être sur **une seule ligne** avec `\n` pour les retours à la ligne
3. Ajoutez dans `.env.local` :
   ```env
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   ```

---

## 📝 Exemple de `.env.local` Complet

Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxx...
STRIPE_SECRET_KEY=sk_test_51xxxx...
STRIPE_WEBHOOK_SECRET=whsec_xxxx...

# Firebase Configuration
FIREBASE_PROJECT_ID=shobmarket-341da
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@shobmarket-341da.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

---

## ✅ Après Configuration

1. **Redémarrer le serveur Next.js** :
   ```powershell
   # Arrêtez le serveur (Ctrl+C)
   npm run dev
   ```

2. **Re-vérifier avec le script de diagnostic** :
   ```powershell
   node scripts/test-payment-system.js
   ```

3. **Tester un paiement** et vérifier les logs serveur

---

## 🚨 Problèmes Courants

### "Les variables ne sont pas chargées"

- Vérifiez que le fichier s'appelle exactement `.env.local` (avec le point)
- Vérifiez qu'il est à la **racine du projet** (même niveau que `package.json`)
- **Redémarrez** le serveur Next.js après modification

### "FIREBASE_PRIVATE_KEY invalide"

- La clé doit être entre guillemets doubles `"`
- Les retours à la ligne doivent être `\n` (pas de vrais retours à la ligne)
- La clé complète doit être sur une seule ligne

### "STRIPE_WEBHOOK_SECRET invalide"

- Le secret commence toujours par `whsec_`
- En local, utilisez Stripe CLI pour obtenir un secret temporaire
- En production, utilisez le secret du dashboard Stripe

