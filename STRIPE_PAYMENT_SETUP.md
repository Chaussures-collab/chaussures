# Configuration Stripe Payment Intents - Mode Live

## ✅ Vérifications avant passage en mode live

### 1. Variables d'environnement

Assurez-vous d'avoir les bonnes clés Stripe en mode live :

```env
# Mode Test (actuel)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Mode Live (à configurer)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 2. Configuration du Payment Intent

Le fichier `src/pages/api/create-payment-intent.ts` est configuré avec :
- ✅ `automatic_payment_methods` activé (recommandé)
- ✅ Métadonnées utilisateur incluses
- ✅ Montant en centimes (EUR)

### 3. Webhooks Stripe

**Important** : Configurez les webhooks Stripe pour le mode live :

1. Allez dans le Dashboard Stripe → Webhooks
2. Ajoutez l'endpoint : `https://votre-domaine.com/api/webhooks/stripe`
3. Sélectionnez les événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.requires_action`
4. Copiez le **Webhook Secret** et ajoutez-le à vos variables d'environnement :
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 4. Pages de succès/échec

Vérifiez que les pages suivantes existent :
- ✅ `/checkout/success` - Page de confirmation de paiement
- ✅ `/checkout/cancel` - Page d'annulation (optionnelle)

### 5. Tests en mode test

Avant de passer en live, testez avec des cartes de test :

**Cartes de test Stripe :**
- Succès : `4242 4242 4242 4242`
- 3D Secure : `4000 0025 0000 3155`
- Échec : `4000 0000 0000 0002`

**Dates :** N'importe quelle date future
**CVC :** N'importe quel 3 chiffres
**Code postal :** N'importe quel code postal

### 6. Sécurité

✅ **PCI Compliance** : Avec Stripe Elements, vous n'avez pas besoin de certification PCI car les données de carte ne passent jamais par vos serveurs.

✅ **HTTPS** : Assurez-vous que votre site est en HTTPS en production.

### 7. Vérification du code

Le système utilise maintenant :
- ✅ **Payment Intents** au lieu de Checkout Sessions
- ✅ **Stripe Elements** pour le formulaire personnalisé
- ✅ **Client-side confirmation** avec `confirmPayment`
- ✅ **Webhooks** pour confirmer les paiements

### 8. Checklist avant le passage en live

- [ ] Clés API Stripe Live configurées
- [ ] Webhook configuré avec le bon endpoint
- [ ] Webhook Secret ajouté aux variables d'environnement
- [ ] Tests effectués avec des cartes de test
- [ ] Pages de succès/échec fonctionnelles
- [ ] HTTPS activé sur le domaine
- [ ] Variables d'environnement sécurisées (pas dans le code)
- [ ] Logs d'erreurs configurés
- [ ] Monitoring des paiements activé

### 9. Monitoring

Après le passage en live :
- Surveillez les logs Stripe Dashboard
- Vérifiez les webhooks reçus
- Testez avec une vraie carte (petit montant)
- Surveillez les erreurs dans vos logs

### 10. Support

En cas de problème :
1. Vérifiez les logs Stripe Dashboard
2. Vérifiez les logs de votre application
3. Testez avec les cartes de test en mode test
4. Consultez la documentation Stripe : https://stripe.com/docs/payments/payment-intents

## Notes importantes

⚠️ **Ne jamais commiter les clés API dans le code**
⚠️ **Toujours tester en mode test avant le passage en live**
⚠️ **Les webhooks sont essentiels pour confirmer les paiements**

