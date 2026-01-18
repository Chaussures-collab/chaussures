# 🔧 Correction Erreur Webhook Stripe sur Vercel

## 🐛 Problème

En production sur Vercel, l'erreur suivante se produisait :

```
No signatures found matching the expected signature for payload. 
Are you passing the raw request body you received from Stripe?
```

Cette erreur se produisait parce que le **body de la requête était parsé en JSON** avant d'atteindre le handler, ce qui empêchait Stripe de vérifier la signature correctement.

## ✅ Corrections Apportées

### 1. **Retrait de `export const runtime`** (ligne 18)
   - Cette syntaxe est pour **App Router** uniquement, pas pour **Pages Router**
   - Dans `src/pages/api/`, on utilise Pages Router
   - Cette ligne causait des problèmes sur Vercel

### 2. **Amélioration de la récupération du body brut**
   - Ajout de plusieurs méthodes de récupération du body brut
   - Détection automatique du format du body (Buffer, string, objet)
   - Message d'erreur clair si le body a été parsé en JSON

### 3. **Création de `vercel.json`**
   - Configuration pour forcer les bonnes settings sur Vercel
   - Assure que les fonctions webhook ont la durée maximale nécessaire

## 📋 Vérifications à Effectuer

### 1. **Variables d'environnement Vercel**

Assurez-vous que `STRIPE_WEBHOOK_SECRET` est bien configuré sur Vercel :

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Vérifiez que `STRIPE_WEBHOOK_SECRET` existe et correspond au secret de votre endpoint Stripe

**Important** : Le secret doit commencer par `whsec_` pour les webhooks en production.

### 2. **Endpoint Webhook dans Stripe Dashboard**

1. Allez sur [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Cliquez sur votre endpoint (ex: `https://votre-site.vercel.app/api/webhooks/stripe`)
3. Copiez le **Signing secret** (commence par `whsec_`)
4. Vérifiez qu'il correspond à `STRIPE_WEBHOOK_SECRET` sur Vercel

### 3. **Test après Déploiement**

Après avoir déployé les corrections :

```bash
# Déployer sur Vercel
git add .
git commit -m "Fix: Webhook Stripe signature verification"
git push
```

Une fois déployé, testez avec un paiement réel ou utilisez Stripe CLI :

```bash
# Avec Stripe CLI (si installé)
stripe trigger payment_intent.succeeded
```

### 4. **Vérification des Logs Vercel**

1. Allez sur Vercel Dashboard → Deployments
2. Cliquez sur le dernier déploiement
3. Onglet "Functions" → `/api/webhooks/stripe`
4. Vérifiez les logs pour voir si les webhooks fonctionnent

## 🔍 Diagnostic des Erreurs

### Si l'erreur persiste :

1. **Vérifiez que `bodyParser: false` est bien respecté**
   - Le body ne doit PAS être un objet JSON dans les logs
   - Il doit être un Buffer ou une string brute

2. **Vérifiez le secret webhook**
   ```bash
   # Sur Vercel, vérifiez que la variable est bien définie
   # La valeur doit correspondre exactement au secret de Stripe Dashboard
   ```

3. **Vérifiez qu'aucun middleware ne parse le body**
   - Il ne doit pas y avoir de middleware global qui parse le body
   - Le fichier `vercel.json` est maintenant présent pour éviter cela

## 📝 Fichiers Modifiés

- ✅ `src/pages/api/webhooks/stripe.ts` : Correction de la récupération du body brut
- ✅ `vercel.json` : Configuration Vercel pour les webhooks

## 🎯 Résultat Attendu

Après ces corrections, les webhooks Stripe devraient fonctionner correctement en production sur Vercel, avec :
- ✅ Vérification de signature réussie
- ✅ Création des commandes
- ✅ Mise à jour du stock
- ✅ Récupération des paniers abandonnés
- ✅ Envoi des emails de confirmation

