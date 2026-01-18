# 📦 Système d'Expédition Automatique et Manuelle

## Vue d'ensemble

Ce système permet d'envoyer automatiquement ou manuellement des emails de confirmation d'expédition aux clients lorsque leurs commandes sont expédiées, avec numéro de suivi et date de livraison estimée (3 jours après).

## ✨ Fonctionnalités

### 1. **Envoi Automatique** (Cron Job)
- ✅ Envoie automatiquement les emails d'expédition pour les commandes créées il y a 3 jours ou plus
- ✅ Génère automatiquement un numéro de suivi unique
- ✅ Calcule la date de livraison estimée (3 jours après l'expédition)
- ✅ Marque la commande comme "SHIPPED"
- ✅ Marque l'email comme envoyé pour éviter les doublons

**Endpoint** : `/api/shipping/send-shipping-emails`

**Schedule** : Tous les jours à 9h00 (configuré dans `vercel.json`)

### 2. **Envoi Manuel** (Admin)
- ✅ Permet à un admin d'expédier manuellement une commande
- ✅ Permet de spécifier un numéro de suivi personnalisé
- ✅ Permet de spécifier le nombre de jours pour la livraison (par défaut: 3 jours)
- ✅ Envoie immédiatement l'email de confirmation d'expédition

**Endpoint** : `/api/shipping/manual-ship`

**Méthode** : `POST`

**Body** :
```json
{
  "orderId": "uuid-de-la-commande",
  "trackingNumber": "TRK123456789", // Optionnel, généré automatiquement si non fourni
  "estimatedDeliveryDays": 3 // Optionnel, par défaut 3 jours
}
```

## 🔧 Configuration

### Variables d'Environnement

Aucune variable d'environnement supplémentaire n'est requise. Le système utilise les mêmes configurations que le système d'email existant :
- `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, `MICROSOFT_TENANT_ID` (pour Microsoft Graph API)
- OU `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` (pour SMTP)
- `ADMIN_EMAIL` (pour l'expéditeur)

### Vercel Cron (Optionnel)

Pour activer le cron automatique sur Vercel, ajoutez dans `vercel.json` :

```json
{
  "crons": [
    {
      "path": "/api/shipping/send-shipping-emails",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Note** : Le cron est déjà configuré dans `vercel.json`. Pour tester localement, vous pouvez appeler l'endpoint manuellement avec le secret :

```bash
curl -X POST "http://localhost:3000/api/shipping/send-shipping-emails?secret=VOTRE_CRON_SECRET"
```

## 📋 Structure des Données

### Champs ajoutés aux commandes (OrderData)

```typescript
interface OrderData {
  // ... champs existants
  trackingNumber?: string;           // Numéro de suivi (ex: "TRK240117123456")
  shippedAt?: Date;                  // Date d'expédition
  estimatedDeliveryDate?: Date;      // Date de livraison estimée
  shippingEmailSent?: boolean;       // Email d'expédition envoyé ?
  shippingEmailSentAt?: Date;        // Date d'envoi de l'email
}
```

### Format du Numéro de Suivi

Le numéro de suivi suit le format : `TRKYYMMDDNNNNNN`
- `TRK` : Préfixe fixe
- `YYMMDD` : Date (année, mois, jour)
- `NNNNNN` : 6 chiffres aléatoires

**Exemple** : `TRK240117123456` (17 janvier 2024, numéro 123456)

## 📧 Email de Confirmation d'Expédition

L'email contient :
- ✅ Numéro de commande
- ✅ Numéro de suivi (mis en évidence)
- ✅ Date de livraison estimée (format français : "lundi 20 janvier 2026")
- ✅ Récapitulatif des articles commandés
- ✅ Montant total
- ✅ Instructions pour suivre le colis

**Sujet** : `📦 Votre commande #[orderId] a été expédiée`

## 🔄 Flux Automatique

```
1. Commande créée avec statut "PAID"
   ↓
2. 3 jours plus tard, le cron job s'exécute
   ↓
3. Le système recherche les commandes PAID créées il y a ≥ 3 jours
   ↓
4. Pour chaque commande :
   a. Génère un numéro de suivi
   b. Calcule la date de livraison (3 jours après)
   c. Marque la commande comme "SHIPPED"
   d. Envoie l'email de confirmation d'expédition
   e. Marque l'email comme envoyé
```

## 🔄 Flux Manuel

```
1. Admin appelle POST /api/shipping/manual-ship
   Body: { orderId, trackingNumber?, estimatedDeliveryDays? }
   ↓
2. Le système :
   a. Vérifie que la commande existe et est "PAID"
   b. Utilise ou génère un numéro de suivi
   c. Calcule la date de livraison
   d. Marque la commande comme "SHIPPED"
   e. Envoie l'email de confirmation d'expédition
   f. Marque l'email comme envoyé
   ↓
3. Retourne le numéro de suivi et la date de livraison
```

## 🧪 Tests

### Test de l'Envoi Automatique

```bash
# Avec Vercel CLI
vercel cron

# Ou manuellement avec secret
curl -X POST "https://votre-site.vercel.app/api/shipping/send-shipping-emails?secret=VOTRE_CRON_SECRET"

# Ou localement
curl -X POST "http://localhost:3000/api/shipping/send-shipping-emails?secret=VOTRE_CRON_SECRET"
```

### Test de l'Envoi Manuel

```bash
curl -X POST "https://votre-site.vercel.app/api/shipping/manual-ship" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "uuid-de-la-commande",
    "trackingNumber": "TRK240117123456",
    "estimatedDeliveryDays": 3
  }'
```

## 📝 Notes Importantes

1. **Double Envoi** : Le système évite les doublons en vérifiant `shippingEmailSent` avant d'envoyer.

2. **Date de Livraison** : Par défaut, la livraison est estimée à 3 jours après l'expédition. Cela peut être personnalisé dans l'envoi manuel.

3. **Statut de Commande** : Seules les commandes avec le statut "PAID" peuvent être expédiées.

4. **Numéro de Suivi** : Le numéro est généré automatiquement mais peut être fourni manuellement pour correspondre à un numéro de transporteur réel.

## 🚀 Déploiement

1. Assurez-vous que les variables d'environnement email sont configurées sur Vercel
2. Le cron est automatiquement activé si configuré dans `vercel.json`
3. Pour tester le cron, attendez 3 jours après une commande ou appelez manuellement l'endpoint

## 🔐 Sécurité

Pour protéger l'endpoint automatique contre les appels non autorisés, définissez `CRON_SECRET` dans les variables d'environnement Vercel. Le cron Vercel passera automatiquement ce secret dans l'URL.

Pour les appels manuels, vous pouvez ajouter une authentification supplémentaire (token JWT, API key, etc.) selon vos besoins.

