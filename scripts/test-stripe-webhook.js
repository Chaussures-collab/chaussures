/**
 * Test du webhook Stripe - Payment Intent Succeeded
 * 
 * Simule un événement webhook réel de Stripe pour un paiement réussi
 * Usage: npm run test:stripe-webhook
 *        npx tsx scripts/test-stripe-webhook.js
 */

// Charger les variables d'environnement depuis .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Définir les variables d'environnement par défaut
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "shobmarket-341da";
}

// Clé Stripe de test (si non configurée)
if (!process.env.STRIPE_SECRET_KEY) {
  process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
}

// Simuler l'événement webhook Stripe pour payment_intent.succeeded
// Basé sur la réponse réelle de Stripe fournie
const stripeWebhookEvent = {
  id: "evt_1Sq1qeCyUBFsH1VqrA1b2c3d",
  object: "event",
  api_version: "2025-09-30",
  created: 1768526948,
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_3Sq1qQCyUBFsH1Vq1TxZijE1",
      object: "payment_intent",
      amount: 2000,
      amount_capturable: 0,
      amount_details: {
        tip: {}
      },
      amount_received: 2000,
      application: null,
      application_fee_amount: null,
      automatic_payment_methods: null,
      canceled_at: null,
      cancellation_reason: null,
      capture_method: "automatic_async",
      charges: {
        object: "list",
        data: [
          {
            id: "ch_1Sq1qeCyUBFsH1VqrA1b2c3d",
            object: "charge",
            amount: 2000,
            amount_captured: 2000,
            amount_refunded: 0,
            balance_transaction: "txn_1Sq1qeCyUBFsH1VqrA1b2c3d",
            captured: true,
            created: 1768526938,
            currency: "eur",
            customer: null,
            description: null,
            dispute: null,
            disputed: false,
            failure_code: null,
            failure_message: null,
            fraud_details: null,
            invoice: null,
            livemode: false,
            metadata: {
              userId: "test-user-123",
              userEmail: "test@example.com",
              totalAmount: "20",
              itemsJson: "[{\"id\":\"prod-123\",\"name\":\"Test Product\",\"price\":20,\"quantity\":1}]"
            },
            outcome: {
              network_status: "approved_by_network",
              reason: null,
              risk_level: "normal",
              risk_score: 32,
              seller_message: "Payment complete.",
              type: "authorized"
            },
            paid: true,
            payment_intent: "pi_3Sq1qQCyUBFsH1Vq1TxZijE1",
            payment_method: "pm_1Sq1qaCyUBFsH1VqwY7xcO2H",
            payment_method_details: {
              card: {
                brand: "visa",
                checks: {
                  address_line1_check: null,
                  address_postal_code_check: null,
                  cvc_check: "pass"
                },
                country: "US",
                exp_month: 12,
                exp_year: 2025,
                fingerprint: "a1b2c3d4e5f6g7h8",
                funding: "credit",
                last4: "4242",
                network: "visa"
              },
              type: "card"
            },
            receipt_email: null,
            receipt_number: null,
            refunded: false,
            review: null,
            shipping: null,
            source: null,
            statement_descriptor: null,
            status: "succeeded"
          }
        ],
        has_more: false,
        total_count: 1
      },
      client_secret: "pi_3Sq1qQCyUBFsH1Vq1TxZijE1_secret_abcdef123456",
      confirmation_method: "automatic",
      created: 1768526938,
      currency: "eur",
      customer: null,
      description: null,
      excluded_payment_method_types: [],
      invoice: null,
      last_payment_error: null,
      livemode: false,
      metadata: {
        userId: "test-user-123",
        userEmail: "test@example.com",
        totalAmount: "20",
        itemsJson: "[{\"id\":\"prod-123\",\"name\":\"Test Product\",\"price\":20,\"quantity\":1}]"
      },
      next_action: null,
      payment_method: "pm_1Sq1qaCyUBFsH1VqwY7xcO2H",
      payment_method_types: ["card"],
      processing: null,
      receipt_email: null,
      review: null,
      setup_future_usage: null,
      shipping: null,
      source: null,
      status: "succeeded"
    }
  },
  livemode: false,
  pending_webhooks: 1,
  request: {
    id: null,
    idempotency_key: "0efc1bd5-40af-4ec1-bca0-20970370a3c6"
  }
};

async function testStripeWebhookEvent() {
  try {
    console.log('🚀 Test du webhook Stripe - payment_intent.succeeded');
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    console.log('📨 Événement webhook Stripe reçu:');
    console.log(`   ID: ${stripeWebhookEvent.id}`);
    console.log(`   Type: ${stripeWebhookEvent.type}`);
    console.log(`   Payment Intent: ${stripeWebhookEvent.data.object.id}`);
    console.log(`   Montant: ${stripeWebhookEvent.data.object.amount / 100}€`);
    console.log(`   Statut: ${stripeWebhookEvent.data.object.status}`);
    console.log(`   Devises: ${stripeWebhookEvent.data.object.currency}`);
    console.log('');
    
    // Vérifier les métadonnées
    const metadata = stripeWebhookEvent.data.object.metadata;
    console.log('📦 Métadonnées du paiement:');
    console.log(`   User ID: ${metadata.userId}`);
    console.log(`   User Email: ${metadata.userEmail}`);
    console.log(`   Montant Total: ${metadata.totalAmount}€`);
    const items = JSON.parse(metadata.itemsJson);
    console.log(`   Items: ${items.length} produit(s)`);
    items.forEach((item, idx) => {
      console.log(`     ${idx + 1}. ${item.name} - ${item.price}€ x${item.quantity}`);
    });
    console.log('');
    
    // Conversion en format compatible avec notre système
    console.log('🔄 Conversion au format interne...');
    const webhookData = {
      sessionId: stripeWebhookEvent.data.object.id,
      customerEmail: metadata.userEmail,
      amountTotal: stripeWebhookEvent.data.object.amount,
      currency: stripeWebhookEvent.data.object.currency,
      paymentStatus: "PAID",
      metadata: {
        userId: metadata.userId,
        userEmail: metadata.userEmail,
        totalAmount: metadata.totalAmount,
        itemsJson: metadata.itemsJson
      }
    };
    
    console.log('✅ Format converti avec succès');
    console.log('');
    
    // Maintenant tester le PaymentManager
    console.log('📋 Test du PaymentManager avec les données Stripe...');
    const module = await import('../src/services/payment/PaymentManager.ts');
    const PaymentManager = module.PaymentManager;
    
    const paymentManager = new PaymentManager({}, {}, {});
    
    console.log('🔄 Appel de handlePaymentWebhook...');
    const result = await paymentManager.handlePaymentWebhook(webhookData);
    
    console.log('\n✅ Test du webhook Stripe complété!');
    console.log('🎉 Le paiement Stripe a été traité correctement!');
    console.log('');
    console.log('📊 Résultat du traitement:');
    console.log(result);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    // Afficher des instructions selon le type d'erreur
    if (error instanceof Error && error.message.includes('credentials')) {
      console.error('\n💡 Configuration Firebase requise:');
      console.error('   1. Créez un fichier .env.local');
      console.error('   2. Configurez les credentials Firebase');
      console.error('   Voir .env.local.example pour plus de détails\n');
    }
    
    process.exit(1);
  }
}

// Exécuter le test
testStripeWebhookEvent();
