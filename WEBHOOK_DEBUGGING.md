# 🔗 Tests Webhook Stripe - Comparaison Locale vs Plateforme

## ✅ Tests Locaux (Qui fonctionnent)

Vos scripts de test fonctionnent parce qu'ils **simulent** les données Stripe localement:

```bash
npm run test:webhook           # Webhook générique
npm run test:stripe-webhook    # Webhook Stripe réel
```

Ces tests utilisent **les mêmes données** que Stripe envoie, mais:
- ✅ Pas de signature Stripe (ignorée dans les tests)
- ✅ Accès direct au `PaymentManager`
- ✅ Pas d'appel HTTP réel

---

## ❌ Tests via Plateforme (Qui ne marche peut-être pas)

Quand Stripe envoie un webhook réel à votre endpoint:

```
Stripe → POST /api/webhooks/stripe → Vérification signature → Traitement
```

**Les différences:**

| Aspect | Test Local | Stripe Réel |
|--------|-----------|-----------|
| **Signature** | Ignorée | ✅ Requise |
| **URL Accessible** | localhost:3000 | ❌ Doit être publique! |
| **Endpoint** | /api/webhooks/stripe | /api/webhooks/stripe |
| **Variables d'env** | .env.local | Serveur production |
| **Body** | Simulé | Réel (signé par Stripe) |

---

## 🔍 Diagnostic: Qu'est-ce qui ne marche pas?

### ❓ Problème 1: "Signature manquante" ou "Signature invalide"

```bash
# Vérifiez:
1. STRIPE_WEBHOOK_SECRET dans .env.local
2. La valeur vient de Stripe Dashboard > Webhooks > Votre endpoint
```

**Solutions:**

```bash
# Test local d'abord:
npm run test:stripe-webhook   # Si ça marche, le problème vient de Stripe

# Puis vérifiez Stripe:
# Dashboard > Webhooks > Cliquez sur votre endpoint
# Copiez le "Signing secret" (commence par whsec_)
# Mettez-le dans .env.local
```

### ❓ Problème 2: URL non accessible

```
http://localhost:3000/api/webhooks/stripe  ❌ Stripe ne peut pas accéder
https://04154ba480a1.ngrok-free.app/api/webhooks/stripe  ✅ Accessible
https://votre-site.com/api/webhooks/stripe  ✅ Accessible
```

**Solution avec ngrok (local):**

```bash
# Terminal 1: Démarrer ngrok
ngrok http 3000

# Terminal 2: Démarrer Next.js
npm run dev

# Puis dans .env.local:
NEXT_PUBLIC_APP_URL=https://04154ba480a1.ngrok-free.app

# Dans Stripe Dashboard:
# Endpoint URL: https://04154ba480a1.ngrok-free.app/api/webhooks/stripe
```

### ❓ Problème 3: Erreur "Firebase credentials manquants"

```bash
# Vérifiez dans .env.local:
FIREBASE_PROJECT_ID=shobmarket-341da
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@shobmarket-341da.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🚀 Étapes pour Tester

### Étape 1: Test Local (Valider que ça marche)

```bash
npm run test:stripe-webhook

# Attendez-vous à:
# ✅ Test du webhook Stripe - payment_intent.succeeded
# ✅ Firebase Admin SDK initialisé avec credentials personnalisés
# ✅ Commande créée avec l'ID : [uuid]
# ✅ Test du webhook Stripe complété!
```

### Étape 2: Déployer le Code

```bash
# Assurez-vous que tout est commité
git add .
git commit -m "Add webhook endpoints and debug tools"
git push
```

### Étape 3: Configurer Stripe Dashboard

1. **Allez à:** https://dashboard.stripe.com/webhooks
2. **Cliquez:** "Add endpoint"
3. **URL:** `https://votre-domaine.com/api/webhooks/stripe`
4. **Événement:** `payment_intent.succeeded`
5. **Créer**
6. **Copier:** Le "Signing secret" (whsec_...)
7. **Configurer:**
   - Sur le serveur: `STRIPE_WEBHOOK_SECRET=whsec_...`
   - Redémarrer le serveur

### Étape 4: Tester depuis Stripe

1. **Allez à:** https://dashboard.stripe.com/webhooks
2. **Cliquez:** Sur votre endpoint
3. **Scrollez:** À "Events"
4. **Cherchez:** `payment_intent.succeeded`
5. **Cliquez:** "Send test webhook"
6. **Vérifiez:** Les logs

---

## 🔍 Debugging - Où Trouver les Logs?

### Option 1: Via Stripe Dashboard

```
https://dashboard.stripe.com/webhooks
→ Cliquez sur votre endpoint
→ Section "Events"
→ Cliquez sur l'événement pour voir la réponse
```

### Option 2: Via Votre Application

```bash
# Logs en direct:
http://localhost:3000/api/debug/webhook-logs

# Diagnostique complet:
http://localhost:3000/api/debug/webhook-test
```

### Option 3: Logs Serveur

```bash
# Sur votre serveur:
# Consultez les logs via:
# - Heroku: heroku logs --tail
# - Vercel: vercel logs
# - AWS: CloudWatch
# - Votre hôte: SSH et console
```

---

## ✨ Checklist Complète

- [ ] Code local fonctionne: `npm run test:stripe-webhook` ✅
- [ ] Endpoint webhook dans Stripe Dashboard ✅
- [ ] `STRIPE_WEBHOOK_SECRET` copié de Stripe Dashboard
- [ ] `STRIPE_WEBHOOK_SECRET` dans .env du serveur
- [ ] URL publique configurée (ngrok ou domaine réel)
- [ ] Redémarrage du serveur après changement des variables
- [ ] Test webhook envoyé depuis Stripe Dashboard
- [ ] Réponse HTTP 200 reçue
- [ ] Commande créée dans Firestore

---

## 🎯 Résumé

| Situation | Action |
|-----------|--------|
| Test local ne marche pas | `npm run test:stripe-webhook` pour déboguer |
| Test local marche, Stripe non | Vérifier STRIPE_WEBHOOK_SECRET et URL publique |
| Signature invalide | Copier le bon secret depuis Stripe Dashboard |
| URL non accessible | Utiliser ngrok ou domaine réel |
| Firebase erreur | Vérifier variables d'env: FIREBASE_* |
| Tout marche localement | Vérifier que le serveur a les mêmes variables |

