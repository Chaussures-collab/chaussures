/**
 * Script de diagnostic du système de paiement
 * Exécuter avec : node scripts/test-payment-system.js
 */

// Charger les variables d'environnement depuis .env.local
const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  });
  console.log('📝 Fichier .env.local chargé\n');
} else {
  console.log('⚠️  Fichier .env.local non trouvé\n');
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvVar(name) {
  const value = process.env[name];
  if (value) {
    log(`✅ ${name} est configuré`, 'green');
    return true;
  } else {
    log(`❌ ${name} n'est PAS configuré`, 'red');
    return false;
  }
}

async function main() {
  log('\n🔍 Diagnostic du Système de Paiement\n', 'blue');
  
  // 1. Vérifier les variables d'environnement
  log('\n📋 Vérification des variables d\'environnement...\n', 'yellow');
  
  const envVars = {
    'STRIPE_WEBHOOK_SECRET': checkEnvVar('STRIPE_WEBHOOK_SECRET'),
    'FIREBASE_PROJECT_ID': checkEnvVar('FIREBASE_PROJECT_ID'),
    'FIREBASE_CLIENT_EMAIL': checkEnvVar('FIREBASE_CLIENT_EMAIL'),
    'FIREBASE_PRIVATE_KEY': checkEnvVar('FIREBASE_PRIVATE_KEY'),
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': checkEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    'STRIPE_SECRET_KEY': checkEnvVar('STRIPE_SECRET_KEY')
  };

  const missingVars = Object.entries(envVars).filter(([_, exists]) => !exists);
  
  if (missingVars.length > 0) {
    log(`\n⚠️ ${missingVars.length} variable(s) d'environnement manquante(s)`, 'yellow');
    log('Ajoutez-les dans votre fichier .env.local\n', 'yellow');
  } else {
    log('\n✅ Toutes les variables d\'environnement sont configurées', 'green');
  }

  // 2. Tester l'initialisation de Firebase Admin SDK
  log('\n📋 Vérification de Firebase Admin SDK...\n', 'yellow');
  
  try {
    const { adminDb } = require('../src/config/firebase-admin.ts');
    if (adminDb) {
      log('✅ Firebase Admin SDK est initialisé', 'green');
      
      // Tester une connexion simple
      try {
        const testCollection = adminDb.collection('test');
        log('✅ Connexion à Firestore réussie', 'green');
      } catch (error) {
        log(`❌ Erreur de connexion à Firestore: ${error.message}`, 'red');
      }
    } else {
      log('❌ Firebase Admin SDK n\'est pas initialisé', 'red');
    }
  } catch (error) {
    log(`❌ Erreur lors de l'import de Firebase Admin SDK: ${error.message}`, 'red');
    log('💡 Vérifiez que les credentials Firebase sont correctement configurés', 'yellow');
  }

  // 3. Vérifier la structure des fichiers critiques
  log('\n📋 Vérification des fichiers critiques...\n', 'yellow');
  
  const fs = require('fs');
  const path = require('path');
  
  const criticalFiles = [
    'src/pages/api/webhooks/stripe.ts',
    'src/pages/api/create-payment-intent.ts',
    'src/services/payment/PaymentManager.ts',
    'src/services/dashboard/AdminOrderService.ts',
    'src/services/dashboard/AdminProductService.ts',
    'src/services/cart/AdminAbandonedCartService.ts'
  ];

  for (const file of criticalFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`✅ ${file} existe`, 'green');
    } else {
      log(`❌ ${file} n'existe pas`, 'red');
    }
  }

  // 4. Recommandations
  log('\n💡 Recommandations:\n', 'blue');
  
  if (missingVars.length > 0) {
    log('1. Configurez toutes les variables d\'environnement manquantes', 'yellow');
  }
  
  if (!envVars['STRIPE_WEBHOOK_SECRET']) {
    log('2. Pour le développement local, utilisez Stripe CLI:', 'yellow');
    log('   stripe listen --forward-to localhost:3000/api/webhooks/stripe', 'yellow');
    log('   Copiez le "Signing secret" dans STRIPE_WEBHOOK_SECRET\n', 'yellow');
  }
  
  if (!envVars['FIREBASE_PRIVATE_KEY']) {
    log('3. Téléchargez le Service Account Key depuis Firebase Console', 'yellow');
    log('   Projet Settings > Service Accounts > Generate New Private Key\n', 'yellow');
  }
  
  log('4. Vérifiez les logs serveur lors d\'un paiement test:', 'yellow');
  log('   - Cherchez les logs avec 🔵 [Webhook]', 'yellow');
  log('   - Cherchez les logs avec ✅ [AdminOrderService]', 'yellow');
  log('   - Cherchez les erreurs avec ❌\n', 'yellow');
  
  log('5. En production, configurez le webhook dans Stripe Dashboard:', 'yellow');
  log('   - URL: https://votre-domaine.com/api/webhooks/stripe', 'yellow');
  log('   - Événement: payment_intent.succeeded\n', 'yellow');
}

main().catch(console.error);

