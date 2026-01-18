# 🧪 Tester le Webhook en Local

## Étapes pour tester le paiement en local

### 1. Installer Stripe CLI

**Windows (avec Scoop)** :
```powershell
scoop install stripe
```

**Ou télécharger depuis** : https://stripe.com/docs/stripe-cli

### 2. Connecter Stripe CLI à votre compte

```powershell
stripe login
```

### 3. Lancer le listener de webhook (Terminal 1)

**Laissez cette commande tourner** pendant vos tests :

```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Vous verrez un message comme :
```
> Ready! Your webhook signing secret is whsec_xxxxx (^C to quit)
```

**Copiez ce `whsec_xxxxx`** et ajoutez-le dans `.env.local` :
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Redémarrez votre serveur Next.js** après avoir modifié `.env.local`.

### 4. Lancer votre serveur Next.js (Terminal 2)

```powershell
npm run dev
```

### 5. Effectuer un paiement test

1. Allez sur votre site : http://localhost:3000
2. Ajoutez un produit au panier
3. Allez à la page de paiement
4. Utilisez la carte de test Stripe :
   - Numéro : `4242 4242 4242 4242`
   - Date : N'importe quelle date future (ex: 12/25)
   - CVC : N'importe quel 3 chiffres (ex: 123)

### 6. Observer les logs

**Dans le terminal Stripe CLI**, vous devriez voir :
```
2024-01-XX XX:XX:XX  --> payment_intent.succeeded [evt_xxxxx]
2024-01-XX XX:XX:XX  <-- [200] POST http://localhost:3000/api/webhooks/stripe [evt_xxxxx]
```

**Dans le terminal Next.js**, vous devriez voir :
```
🔵 [Webhook] Event type: payment_intent.succeeded
🔵 [Webhook] Payment Intent ID: pi_xxxxx
✅ [Webhook] adminDb est initialisé
🔵 [PaymentManager] handlePaymentWebhook appelé avec: {...}
📦 Création de la commande avec X item(s) pour l'utilisateur ...
✅ [AdminOrderService] Commande créée avec l'ID : xxxxx
✅ [PaymentManager] Stock mis à jour pour X produit(s)
✅ [PaymentManager] Panier(s) abandonné(s) marqué(s) comme récupéré(s)
✅ [PaymentManager] Emails de confirmation envoyés
```

### 7. Vérifier dans Firestore

1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet `shobmarket-341da`
3. Allez dans **Firestore Database**
4. Collection `orders` → Vous devriez voir une nouvelle commande

---

## 🔍 Si ça ne fonctionne pas

### Problème : "No webhook received"

- Vérifiez que Stripe CLI est bien lancé
- Vérifiez que l'URL est correcte : `localhost:3000` (pas `127.0.0.1`)
- Vérifiez que votre serveur Next.js est bien lancé

### Problème : "Signature verification failed"

- Vérifiez que `STRIPE_WEBHOOK_SECRET` dans `.env.local` correspond au secret affiché par Stripe CLI
- **Redémarrez le serveur** après avoir modifié `.env.local`

### Problème : Les logs `🔵 [Webhook]` n'apparaissent pas

- Vérifiez que le webhook atteint bien votre serveur (regardez les logs Stripe CLI)
- Vérifiez que votre endpoint `/api/webhooks/stripe` est accessible
- Testez manuellement : `curl http://localhost:3000/api/webhooks/stripe`

### Problème : Erreur dans `AdminOrderService`

- Vérifiez les logs `❌ [AdminOrderService]` pour voir l'erreur exacte
- Vérifiez que Firebase Admin SDK est initialisé (log `✅ Firebase Admin SDK initialisé`)



