/**
 * Test manuel du webhook de paiement
 * Ce script teste la fonction handlePaymentWebhook du PaymentManager
 * 
 * Usage: npm run test:webhook
 *        npx tsx scripts/test-webhook.js
 *
 * Pour que le test réussisse complètement, vous devez configurer Firebase Admin SDK
 * en définissant les variables d'environnement ou en téléchargeant une clé de compte de service.
 */

// Charger les variables d'environnement depuis .env.local
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Définir les variables d'environnement par défaut si elles n'existent pas
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "shobmarket-341da";
}

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

async function runTest() {
  try {
    console.log('🚀 Démarrage du test du webhook...');
    console.log('📨 Données du webhook:', testWebhookData);
    console.log('');
    
    // Import dynamique du PaymentManager
    const module = await import('../src/services/payment/PaymentManager.ts');
    const PaymentManager = module.PaymentManager;
    
    // Créer une instance de PaymentManager avec des mocks
    const paymentManager = new PaymentManager({}, {}, {});
    
    console.log('✅ PaymentManager instance créée');
    console.log('📝 Appel de handlePaymentWebhook...');
    console.log('');
    
    // Appeler handlePaymentWebhook
    const result = await paymentManager.handlePaymentWebhook(testWebhookData);
    
    console.log('');
    console.log('✅ Test complété avec succès!');
    console.log('📊 Résultat:', result);
    console.log('');
    console.log('🎉 Le webhook a été traité correctement!');
    
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Erreur lors du test:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.stack) {
      console.error('');
      console.error('Stack trace:', error.stack);
    }
    
    // Afficher des instructions pour configurer Firebase
    if (error instanceof Error && error.message.includes('credentials')) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('💡 CONFIGURATION FIREBASE REQUISE');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
      console.error('Pour que le test réussisse, configurez Firebase Admin SDK:');
      console.error('');
      console.error('Option 1: Utiliser des variables d\'environnement');
      console.error('   - Créez un fichier .env.local basé sur .env.local.example');
      console.error('   - Définissez: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
      console.error('');
      console.error('Option 2: Utiliser Google Application Credentials');
      console.error('   - Téléchargez votre service account key depuis Firebase Console');
      console.error('   - Sauvegardez-la dans un fichier JSON');
      console.error('   - Définissez: GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json');
      console.error('');
      console.error('Ressources:');
      console.error('   - Firebase Admin Setup: https://firebase.google.com/docs/admin/setup');
      console.error('   - Service Account: https://console.firebase.google.com/project');
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else if (error instanceof Error && error.message.includes('Firebase')) {
      console.error('');
      console.error('💡 Pour initialiser Firebase Admin:');
      console.error('   1. Créez un fichier .env.local basé sur .env.local.example');
      console.error('   2. Téléchargez votre service account key depuis Firebase Console');
      console.error('   3. Configurez FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, et FIREBASE_PRIVATE_KEY');
    }
    
    process.exit(1);
  }
}

// Exécuter le test
runTest();