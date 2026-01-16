#!/usr/bin/env node

/**
 * Test complet du webhook avec tous les détails des tâches
 * Affiche tous les logs et erreurs de chaque étape
 */

import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Capturer tous les logs et erreurs
const allLogs = [];
const originalLog = console.log;
const originalError = console.error;

function captureLog(level, ...args) {
  const message = args.map(arg => 
    typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)
  ).join(' ');
  allLogs.push({ level, message, timestamp: new Date().toISOString() });
  const levelEmoji = {
    'log': '📝',
    'error': '❌',
    'warn': '⚠️'
  }[level] || '📝';
  originalLog(`${levelEmoji} ${message}`);
}

console.log = (...args) => captureLog('log', ...args);
console.error = (...args) => captureLog('error', ...args);
console.warn = (...args) => captureLog('warn', ...args);

async function testFullWebhook() {
  originalLog('\n🚀 === DÉMARRAGE DU TEST COMPLET DU WEBHOOK === 🚀\n');

  try {
    // Vérifier les configurations
    originalLog('\n📋 === VÉRIFICATION DE LA CONFIGURATION === 📋\n');
    
    const requiredEnvVars = {
      'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY ? `✅ ${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...` : '❌ Manquant',
      'STRIPE_WEBHOOK_SECRET': process.env.STRIPE_WEBHOOK_SECRET ? `✅ ${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 20)}...` : '❌ Manquant',
      'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID || '❌ Manquant',
      'FIREBASE_CLIENT_EMAIL': process.env.FIREBASE_CLIENT_EMAIL ? '✅ Présent' : '❌ Manquant',
      'FIREBASE_PRIVATE_KEY': process.env.FIREBASE_PRIVATE_KEY ? '✅ Présent' : '❌ Manquant',
      'ADMIN_EMAIL': process.env.ADMIN_EMAIL || '❌ Manquant',
      'MICROSOFT_FROM_EMAIL': process.env.MICROSOFT_FROM_EMAIL ? '✅ Présent' : '⚠️ Manquant (SMTP utilisé si disponible)',
      'SMTP_HOST': process.env.SMTP_HOST ? '✅ Présent' : '⚠️ Manquant (Emails désactivés)',
    };

    for (const [key, value] of Object.entries(requiredEnvVars)) {
      originalLog(`${key}: ${value}`);
    }

    // Importer les services
    originalLog('\n🔧 === CHARGEMENT DES SERVICES === 🔧\n');
    
    const { PaymentFactory } = await import('../src/services/payment/PaymentFactory.ts');
    originalLog('✅ PaymentFactory chargé');

    // Créer le PaymentManager
    const paymentManager = PaymentFactory.createPaymentManager();
    originalLog('✅ PaymentManager créé');

    // Données de test
    originalLog('\n📊 === CRÉATION DES DONNÉES DE TEST === 📊\n');
    
    const testWebhookData = {
      sessionId: 'pi_test_webhook_' + Date.now(),
      customerEmail: 'enlignechaussures@gmail.com',
      amountTotal: 2000, // 20€
      currency: 'eur',
      paymentStatus: 'PAID',
      metadata: {
        userId: 'JTTNbpy069VG2uQ6hCEPx2HU8C43' + Date.now(),
        userEmail: 'enlignechaussures@gmail.com',
        nom: 'Dupont',
        prenom: 'Jean',
        totalAmount: '20',
        itemsJson: JSON.stringify([
          {
            id: '0Kx8p44JS6PZj5CgNiHE',
            name: 'NIKE TN',
            price: 10,
            quantity: 1,
            description: 'Test product 1',
            imageUrl: 'https://example.com/image1.jpg'
          },
          {
            id: '0TYt0I7qeWrFwKofNCwA',
            name: 'Survetement Adidas',
            price: 10,
            quantity: 1,
            description: 'Test product 2',
            imageUrl: 'https://example.com/image2.jpg'
          }
        ])
      }
    };

    originalLog('Données de test créées:');
    originalLog(`  - sessionId: ${testWebhookData.sessionId}`);
    originalLog(`  - userId: ${testWebhookData.metadata.userId}`);
    originalLog(`  - montant: ${testWebhookData.amountTotal / 100}€`);
    originalLog(`  - items: 2 produits`);

    // Traiter le webhook
    originalLog('\n🔄 === TRAITEMENT DU WEBHOOK === 🔄\n');
    
    const result = await paymentManager.handlePaymentWebhook(testWebhookData);
    
    originalLog('\n✅ === RÉSULTAT DU TRAITEMENT === ✅\n');
    originalLog('Résultat:', result);

    // Résumé des logs
    originalLog('\n📋 === RÉSUMÉ DES LOGS === 📋\n');
    
    const logsByLevel = {
      log: allLogs.filter(l => l.level === 'log'),
      error: allLogs.filter(l => l.level === 'error'),
      warn: allLogs.filter(l => l.level === 'warn')
    };

    originalLog(`✅ Logs standards: ${logsByLevel.log.length}`);
    originalLog(`❌ Erreurs: ${logsByLevel.error.length}`);
    originalLog(`⚠️  Warnings: ${logsByLevel.warn.length}`);

    // Afficher les erreurs/warnings détaillées
    if (logsByLevel.error.length > 0) {
      originalLog('\n❌ === DÉTAIL DES ERREURS === ❌\n');
      logsByLevel.error.forEach((log, i) => {
        originalLog(`${i + 1}. ${log.message}`);
      });
    }

    if (logsByLevel.warn.length > 0) {
      originalLog('\n⚠️  === DÉTAIL DES WARNINGS === ⚠️\n');
      logsByLevel.warn.forEach((log, i) => {
        originalLog(`${i + 1}. ${log.message}`);
      });
    }

    // Vérifier si tout est OK
    if (result.success) {
      originalLog('\n✅ ✅ ✅ SUCCÈS! Le webhook a été traité correctement! ✅ ✅ ✅\n');
      originalLog(`Commande créée: ${result.orderId}`);
      if (logsByLevel.error.length === 0) {
        originalLog('Aucune erreur - toutes les tâches ont réussi!');
      } else {
        originalLog(`⚠️  ATTENTION: ${logsByLevel.error.length} erreur(s) ont été rencontrées mais le paiement a quand même été traité.`);
      }
      process.exit(0);
    } else {
      originalLog('\n❌ ÉCHEC! Le webhook n\'a pas pu être traité!\n');
      originalLog(`Raison: ${result.message}`);
      originalLog(`Erreur: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    originalError('\n💥 === ERREUR NON GÉRÉE === 💥\n');
    originalError('Erreur:', error);
    if (error instanceof Error) {
      originalError('Stack:', error.stack);
    }
    
    originalLog('\n📋 === TOUS LES LOGS JUSQU\'À L\'ERREUR === 📋\n');
    allLogs.forEach(log => {
      const emoji = { log: '📝', error: '❌', warn: '⚠️' }[log.level];
      originalLog(`${emoji} ${log.message}`);
    });
    
    process.exit(1);
  }
}

testFullWebhook();
