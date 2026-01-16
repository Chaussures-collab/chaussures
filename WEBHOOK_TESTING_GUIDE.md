/**
 * Guide de test du webhook Stripe depuis la plateforme
 * 
 * Ce document explique comment tester votre webhook Stripe directement
 * depuis la plateforme Stripe (stripe.com/dashboard)
 */

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                    GUIDE TEST WEBHOOK STRIPE                              ║
╚════════════════════════════════════════════════════════════════════════════╝

🚀 ÉTAPE 1: Vérifier la configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Variables d'environnement nécessaires:
   - STRIPE_SECRET_KEY: sk_test_... (clé secrète)
   - STRIPE_WEBHOOK_SECRET: whsec_... (secret du webhook)
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: pk_test_... (clé publique)

✅ Fichier .env.local doit avoir ces valeurs!

🔍 Vérifier: Accédez à http://localhost:3000/api/debug/webhook-test


📋 ÉTAPE 2: Configurer l'endpoint webhook dans Stripe
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Allez sur: https://dashboard.stripe.com/webhooks
2. Cliquez "Add endpoint"
3. URL: https://votre-domaine.com/api/webhooks/stripe
   Exemples:
   - Local: http://localhost:3000/api/webhooks/stripe
   - ngrok: https://04154ba480a1.ngrok-free.app/api/webhooks/stripe
   - Production: https://snipersmarket.fr/api/webhooks/stripe

4. Sélectionnez l'événement: "payment_intent.succeeded"
5. Créez l'endpoint
6. Copiez le "Signing secret" (whsec_...)
7. Mettez-le dans .env.local comme STRIPE_WEBHOOK_SECRET


🔍 ÉTAPE 3: Tester l'endpoint
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Option A: Via Stripe Dashboard
  1. Allez sur https://dashboard.stripe.com/webhooks
  2. Cliquez sur votre endpoint
  3. Scrollez à "Events"
  4. Cherchez "payment_intent.succeeded"
  5. Cliquez "Send test webhook"

Option B: Via curl (local)
  curl -X POST http://localhost:3000/api/debug/webhook-test \\
    -H "Content-Type: application/json"

Option C: Via npm (test local complet)
  npm run test:stripe-webhook


🐛 ÉTAPE 4: Déboguer les erreurs
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Erreur 1: "Signature manquante"
  ❌ La signature n'a pas été envoyée par Stripe
  ✅ Solution: Vérifiez que STRIPE_WEBHOOK_SECRET est correct

Erreur 2: "Signature invalide"
  ❌ La signature ne correspond pas au webhook secret
  ✅ Solution: Vérifiez STRIPE_WEBHOOK_SECRET dans Stripe Dashboard

Erreur 3: "userId manquant dans les métadonnées"
  ❌ Les métadonnées du paiement n'ont pas userId
  ✅ Solution: Vérifiez que vous envoyez les métadonnées lors de la création du paiement

Erreur 4: "Produit introuvable"
  ❌ Le produit test n'existe pas en base
  ✅ Solution: C'est normal avec les données test - créez des produits réels

Erreur 5: "Firebase credentials manquants"
  ❌ Les identifiants Firebase ne sont pas configurés
  ✅ Solution: Configurez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY


🔗 ÉTAPE 5: URLs utiles
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Diagnostique:     http://localhost:3000/api/debug/webhook-test
📜 Logs récents:     http://localhost:3000/api/debug/webhook-logs
🧪 Stripe Dashboard: https://dashboard.stripe.com/webhooks
🔑 API Keys:         https://dashboard.stripe.com/apikeys
💳 Test Payments:    https://dashboard.stripe.com/test/payments


✨ CHECKLIST DE VÉRIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

□ STRIPE_SECRET_KEY configuré dans .env.local
□ STRIPE_WEBHOOK_SECRET configuré dans .env.local
□ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY configuré
□ Endpoint webhook ajouté dans Stripe Dashboard
□ Endpoint webhook pointe sur la bonne URL
□ Test webhook envoyé depuis Stripe Dashboard
□ Logs webhook consultables via /api/debug/webhook-logs
□ Commande créée dans Firebase après webhook
□ Email de confirmation envoyé


🎯 POINTS CLÉS À RETENIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Le webhook DOIT être accessible de l'extérieur (pas localhost sans ngrok)
2. La signature Stripe est ESSENTIELLE pour la sécurité
3. Les métadonnées DOIVENT inclure userId et itemsJson
4. Les erreurs retournent 200 pour éviter les retries infinies
5. Tous les logs sont affichés en console du serveur


📞 SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si ça ne marche toujours pas:
1. Vérifiez les logs: npm run test:stripe-webhook
2. Vérifiez les variables d'env: http://localhost:3000/api/debug/webhook-test
3. Vérifiez les logs récents: http://localhost:3000/api/debug/webhook-logs
4. Consultez Stripe Dashboard > Webhooks > Votre endpoint > Events

`);
