# 🔍 Diagnostic Complet du Système de Paiement

## 📋 Analyse du Flux de A à Z

### 1. **Initiation du Paiement** ✅ (Fonctionne)
- **Fichier** : `src/components/checkout/PaymentCheckout.tsx`
- **Endpoint** : `/api/create-payment-intent`
- **Action** : 
  - Transforme le panier en items
  - Envoie `items`, `userId`, `userEmail` à l'API
  - Reçoit `clientSecret` de Stripe

### 2. **Création du Payment Intent** ✅ (Fonctionne)
- **Fichier** : `src/pages/api/create-payment-intent.ts`
- **Action** :
  - Valide les données
  - Crée un Payment Intent Stripe avec métadonnées :
    - `userId` ✅
    - `userEmail` ✅
    - `itemsCount` ✅
    - `totalAmount` ✅
    - `itemsJson` (JSON.stringify(items)) ✅
  - Retourne `clientSecret`

### 3. **Confirmation du Paiement** ✅ (Fonctionne)
- **Fichier** : `src/components/checkout/StripePaymentForm.tsx`
- **Action** : 
  - Le client confirme le paiement
  - Stripe traite le paiement
  - Stripe déclenche un webhook `payment_intent.succeeded`

### 4. **Réception du Webhook** ⚠️ (Point critique)
- **Fichier** : `src/pages/api/webhooks/stripe.ts`
- **URL nécessaire** : `https://votre-domaine.com/api/webhooks/stripe`
- **Prérequis** :
  - ✅ `STRIPE_WEBHOOK_SECRET` doit être configuré dans `.env.local`
  - ⚠️ Le webhook doit être configuré dans Stripe Dashboard
  - ⚠️ L'URL doit être accessible publiquement (pas localhost sauf avec Stripe CLI)

### 5. **Traitement du Webhook** ⚠️ (Point critique)
- **Fichier** : `src/services/payment/PaymentManager.ts`
- **Action** :
  - Extrait les métadonnées du Payment Intent
  - Parse `itemsJson` pour récupérer les items
  - Crée la commande via `AdminOrderService`
  - Met à jour le stock via `AdminProductService`
  - Marque les paniers comme récupérés via `AdminAbandonedCartService`
  - Envoie les emails via `EmailService`

### 6. **Création de la Commande** ⚠️ (Point critique)
- **Fichier** : `src/services/dashboard/AdminOrderService.ts`
- **Prérequis** :
  - ✅ `FIREBASE_PROJECT_ID` doit être configuré
  - ✅ `FIREBASE_CLIENT_EMAIL` doit être configuré
  - ✅ `FIREBASE_PRIVATE_KEY` doit être configuré
  - ⚠️ Firebase Admin SDK doit être correctement initialisé

## 🚨 Points de Défaillance Identifiés

### ❌ PROBLÈME 1 : Webhook non configuré ou non reçu
**Symptômes** :
- Aucun log `🔵 [Webhook]` dans la console serveur
- Les commandes ne sont jamais créées

**Solutions** :
1. **En développement local** : Utiliser Stripe CLI
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Cela donnera un `STRIPE_WEBHOOK_SECRET` temporaire à mettre dans `.env.local`

2. **En production** : Configurer le webhook dans Stripe Dashboard
   - Allez sur https://dashboard.stripe.com/webhooks
   - Cliquez sur "Add endpoint"
   - URL : `https://votre-domaine.com/api/webhooks/stripe`
   - Événements : `payment_intent.succeeded`
   - Copiez le "Signing secret" dans `STRIPE_WEBHOOK_SECRET`

### ❌ PROBLÈME 2 : Firebase Admin SDK non initialisé
**Symptômes** :
- Erreur `adminDb n'est pas initialisé`
- Erreurs Firestore `PERMISSION_DENIED`
- Logs `❌ [AdminOrderService]` avec code d'erreur

**Solutions** :
1. Télécharger le Service Account Key depuis Firebase Console
2. Configurer les variables d'environnement dans `.env.local` :
   ```env
   FIREBASE_PROJECT_ID=shobmarket-341da
   FIREBASE_CLIENT_EMAIL=votre-email@shobmarket-341da.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre clé privée ici\n-----END PRIVATE KEY-----\n"
   ```
   ⚠️ La clé privée doit être sur une seule ligne avec `\n` pour les retours à la ligne

### ❌ PROBLÈME 3 : Métadonnées perdues
**Symptômes** :
- Log `❌ userId manquant dans les métadonnées`
- Log `❌ itemsJson manquant dans les métadonnées`
- Erreur `Aucun item trouvé dans les métadonnées`

**Solutions** :
- Vérifier que `itemsJson` est bien passé dans les métadonnées du Payment Intent
- Vérifier que les métadonnées ne dépassent pas les limites Stripe (500 caractères par clé)

### ❌ PROBLÈME 4 : Erreurs silencieuses
**Symptômes** :
- Le webhook retourne 200 mais rien ne se passe
- Erreurs dans les logs mais le paiement est marqué comme réussi

**Solutions** :
- Vérifier tous les logs `❌` dans la console serveur
- Ne pas ignorer les erreurs dans les catch blocks

## 🔧 Script de Diagnostic

Créez un fichier `test-webhook.js` pour tester manuellement :

```javascript
// Test manuel du webhook
const testWebhookData = {
  sessionId: "pi_test_123",
  customerEmail: "test@example.com",
  amountTotal: 10000, // 100€ en centimes
  currency: "eur",
  paymentStatus: "PAID",
  metadata: {
    userId: "test-user-id",
    userEmail: "test@example.com",
    totalAmount: "100",
    itemsJson: JSON.stringify([
      {
        id: "prod-123",
        name: "Produit Test",
        price: 100,
        quantity: 1
      }
    ])
  }
};

// Appeler PaymentManager.handlePaymentWebhook(testWebhookData)
```

## 📊 Checklist de Vérification

- [ ] `STRIPE_WEBHOOK_SECRET` est configuré dans `.env.local`
- [ ] Le webhook est configuré dans Stripe Dashboard (ou Stripe CLI en local)
- [ ] `FIREBASE_PROJECT_ID` est configuré dans `.env.local`
- [ ] `FIREBASE_CLIENT_EMAIL` est configuré dans `.env.local`
- [ ] `FIREBASE_PRIVATE_KEY` est configuré dans `.env.local` (format correct)
- [ ] Firebase Admin SDK est initialisé (vérifier les logs au démarrage)
- [ ] Le webhook est accessible publiquement (ou via Stripe CLI en local)
- [ ] Les logs montrent `🔵 [Webhook]` quand un paiement est effectué
- [ ] Les métadonnées contiennent `userId` et `itemsJson`

## 🎯 Prochaines Étapes

1. **Vérifier la configuration** : Utiliser le script de diagnostic ci-dessous
2. **Tester en local** : Utiliser Stripe CLI pour simuler les webhooks
3. **Vérifier les logs** : Regarder attentivement tous les logs lors d'un paiement test
4. **Vérifier Firestore** : Aller dans Firebase Console > Firestore pour voir si les commandes sont créées



