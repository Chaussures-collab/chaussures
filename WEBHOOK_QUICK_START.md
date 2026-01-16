# 📋 RÉSUMÉ: Tests Webhook Stripe

## 🎯 Situation Actuelle

✅ **Tests Locaux FONCTIONNENT:**
```bash
npm run test:webhook           # Webhook générique
npm run test:stripe-webhook    # Webhook Stripe (payment_intent.succeeded)
```

❌ **Tests via Plateforme Stripe NE MARCHENT PAS:**
- Quand vous testez depuis https://dashboard.stripe.com/webhooks
- Endpoint: `POST /api/webhooks/stripe`

---

## 🔧 Causes Probables

### 1️⃣ **URL Non Accessible**
Stripe ne peut pas atteindre votre endpoint à cause de `localhost`

```
❌ http://localhost:3000/api/webhooks/stripe
✅ https://04154ba480a1.ngrok-free.app/api/webhooks/stripe
✅ https://votre-site.com/api/webhooks/stripe
```

**Solutions:**
- Utilisez **ngrok** pour le développement local
- Utilisez l'URL de **production** pour la production

### 2️⃣ **Signature Stripe Invalide**
Le `STRIPE_WEBHOOK_SECRET` ne correspond pas

```bash
# Vérifiez:
1. .env.local contient: STRIPE_WEBHOOK_SECRET=whsec_...
2. La valeur vient de Stripe Dashboard > Webhooks > Votre endpoint
3. C'est bien le "Signing secret", pas autre chose
```

### 3️⃣ **Variables d'Environnement Manquantes**
Firebase ou Stripe non configurés sur le serveur

```bash
# Requis:
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FIREBASE_PROJECT_ID=shobmarket-341da
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

---

## ✅ Comment Ça Doit Marcher

```
User Paiement → Stripe → Webhook POST → /api/webhooks/stripe
                           ↓
                      Vérify Signature
                           ↓
                      PaymentManager
                           ↓
                      Créer Commande Firebase
                           ↓
                      Envoyer Email
```

---

## 🚀 Checklist pour Déboguer

### 1. Vérifiez que le code marche localement

```bash
npm run test:stripe-webhook

# Attendez:
# ✅ Firebase Admin SDK initialisé avec credentials personnalisés
# ✅ Commande créée avec l'ID : [uuid]
# ✅ Le paiement Stripe a été traité correctement!
```

### 2. Vérifiez que l'endpoint est accessible

```bash
# Terminal 1: Démarrer ngrok
ngrok http 3000

# Terminal 2: Démarrer Next.js
npm run dev

# Terminal 3: Tester l'endpoint
curl -X POST http://localhost:3000/api/debug/webhook-test
```

### 3. Configurez Stripe Dashboard

1. Allez à: https://dashboard.stripe.com/webhooks
2. Cliquez "Add endpoint"
3. **URL:** `https://04154ba480a1.ngrok-free.app/api/webhooks/stripe` (ou votre domaine)
4. **Événement:** `payment_intent.succeeded`
5. Créez et copiez le "Signing secret"
6. Mettez-le dans `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_...`

### 4. Testez depuis Stripe

1. Allez à: https://dashboard.stripe.com/webhooks
2. Cliquez sur votre endpoint
3. Scrollez à "Events"
4. Cliquez "Send test webhook" sur un `payment_intent.succeeded`
5. Vérifiez le statut (doit être **200 OK**)

### 5. Consultez les Logs

```
http://localhost:3000/api/debug/webhook-logs   ← Logs des webhooks
http://localhost:3000/api/debug/webhook-test   ← Test de diagnostique
```

---

## 📊 Endpoints Disponibles

| URL | Méthode | Purpose |
|-----|---------|---------|
| `/api/webhooks/stripe` | `POST` | Réception des webhooks Stripe |
| `/api/debug/webhook-test` | `GET/POST` | Test et diagnostique |
| `/api/debug/webhook-logs` | `GET` | Voir les logs des webhooks |
| `/api/debug/webhook-logs` | `DELETE` | Effacer les logs |

---

## 🎓 Comprendre la Différence

### Tests Locaux (Scripts)
```javascript
// npm run test:stripe-webhook

// ✅ Accès direct au PaymentManager
// ✅ Pas d'appel HTTP
// ✅ Pas de signature Stripe
// ✅ Utilise .env.local directement

const paymentManager = PaymentFactory.createPaymentManager();
const result = await paymentManager.handlePaymentWebhook(data);
```

### Tests Plateforme (Stripe)
```
Stripe → HTTP POST → /api/webhooks/stripe → Vérify Signature → PaymentManager
                    (Corps signé!)
```

---

## 🔑 Points Clés

1. **Les tests locaux validant que le code marche ✅**
2. **La plateforme teste que l'API accessible et la signature correcte**
3. **Les deux doivent marcher ensemble**

---

## 💡 Prochaines Étapes

1. **Vérifiez:** `npm run test:stripe-webhook` fonctionne ✅ (déjà fait!)
2. **Configurez:** ngrok ou domaine public
3. **Créez:** Endpoint dans Stripe Dashboard
4. **Testez:** "Send test webhook" depuis Stripe
5. **Consultez:** Logs via /api/debug/webhook-logs

---

## 📞 Besoin d'Aide?

**Erreur "Signature invalide"?**
→ Copiez le bon "Signing secret" de Stripe Dashboard

**Erreur "URL non accessible"?**
→ Utilisez ngrok: `ngrok http 3000`

**Erreur "Produit introuvable"?**
→ C'est normal avec les données test - créez des produits réels dans Firebase

**Aucun log visible?**
→ Vérifiez: http://localhost:3000/api/debug/webhook-logs

