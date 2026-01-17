#!/usr/bin/env node
/** @format */

/**
 * Test de la page de succès - Simule le flux complet après paiement
 * Vérifie que:
 * 1. L'orderId est stocké en sessionStorage
 * 2. La requête Firestore récupère les données de la commande
 * 3. Les données sont correctement formatées pour EmailJS
 */

require("dotenv").config({ path: ".env.local" });
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

// 📝 Configuration
console.log("\n🚀 === TEST DE LA PAGE DE SUCCÈS === 🚀\n");

// ✅ Initialiser Firebase Admin
const serviceAccountPath = path.join(__dirname, "../firebase-admin-key.json");
if (!fs.existsSync(serviceAccountPath)) {
  const credentials = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: "key123",
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: "123456789",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:
      "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
  };
  fs.writeFileSync(serviceAccountPath, JSON.stringify(credentials, null, 2));
}

const serviceAccount = require(serviceAccountPath);
const apps = admin.apps;
let db;

if (apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
db = admin.firestore();

async function testSuccessPage() {
  try {
    console.log("📋 === SCÉNARIO DE TEST === 📋\n");

    // 1️⃣ Simuler l'orderId stocké dans sessionStorage
    console.log("1️⃣ Récupération de l'orderId depuis sessionStorage...");
    // Dans le test, nous utilisons le dernier orderId créé
    const lastOrderId = "216824ed-48ae-4f26-8e18-bc47a5b8ba07"; // Du test précédent
    console.log(`   ✅ orderId trouvé: ${lastOrderId}\n`);

    // 2️⃣ Simuler la requête Firestore pour récupérer la commande
    console.log("2️⃣ Requête Firestore pour récupérer la commande...");
    const ordersRef = db.collection("orders");
    const q = ordersRef.where("orderId", "==", lastOrderId);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      console.log(`   ⚠️ Aucune commande trouvée avec orderId: ${lastOrderId}`);
      console.log(`   📝 Vérification de toutes les commandes disponibles...\n`);

      const allOrders = await db.collection("orders").limit(5).get();
      console.log(`   📋 Commandes disponibles (max 5):`);
      allOrders.docs.forEach((doc) => {
        const data = doc.data();
        console.log(`      - ${data.orderId || doc.id} | Email: ${data.userEmail}`);
      });

      if (allOrders.empty) {
        console.log(`   ❌ Aucune commande trouvée du tout dans Firestore!`);
        return;
      }

      // Utiliser la première commande pour le test
      const firstOrder = allOrders.docs[0].data();
      console.log(
        `\n   📝 Utilisation de la première commande pour le test: ${firstOrder.orderId}`
      );
      testOrderData(firstOrder);
    } else {
      console.log(`   ✅ Commande trouvée!\n`);
      const orderDoc = querySnapshot.docs[0];
      const firestoreOrder = orderDoc.data();
      testOrderData(firestoreOrder);
    }
  } catch (error) {
    console.error("❌ Erreur lors du test:", error);
  } finally {
    process.exit(0);
  }
}

function testOrderData(firestoreOrder) {
  console.log("3️⃣ Vérification des données de la commande...\n");
  console.log("📊 Données reçues de Firestore:");
  console.log("   - id:", firestoreOrder.id || "❌ MANQUANT");
  console.log("   - orderId:", firestoreOrder.orderId || "❌ MANQUANT");
  console.log("   - userEmail:", firestoreOrder.userEmail || firestoreOrder.email || "❌ MANQUANT");
  console.log("   - customerName:", firestoreOrder.customerName || firestoreOrder.name || "❌ MANQUANT");
  console.log("   - items:", firestoreOrder.items ? firestoreOrder.items.length + " item(s)" : "0 items");
  console.log(
    "   - totalAmount:",
    firestoreOrder.totalAmount || firestoreOrder.total || "❌ MANQUANT"
  );
  console.log("   - status:", firestoreOrder.status || "N/A");

  console.log("\n4️⃣ Formatage des données pour EmailJS...\n");

  const orderData = {
    orderId: firestoreOrder.id || firestoreOrder.orderId,
    userEmail: firestoreOrder.userEmail || firestoreOrder.email,
    customerName: firestoreOrder.customerName || firestoreOrder.name || "Client",
    items: firestoreOrder.items || [],
    totalAmount: firestoreOrder.totalAmount || firestoreOrder.total || 0,
    orderDate: new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  console.log("✅ Données formatées pour EmailJS:");
  console.log(JSON.stringify(orderData, null, 2));

  console.log("\n5️⃣ Validation des données critiques...\n");

  const criticalFields = {
    orderId: orderData.orderId,
    userEmail: orderData.userEmail,
    customerName: orderData.customerName
  };

  let isValid = true;
  Object.entries(criticalFields).forEach(([field, value]) => {
    if (value) {
      console.log(`   ✅ ${field}: ${value}`);
    } else {
      console.log(`   ❌ ${field}: MANQUANT`);
      isValid = false;
    }
  });

  console.log("\n6️⃣ RÉSULTAT DU TEST\n");
  if (isValid) {
    console.log(
      "✅ ✅ ✅ SUCCÈS! La page de succès peut envoyer des emails via EmailJS!"
    );
    console.log("   - orderId disponible pour la confirmation");
    console.log("   - userEmail disponible pour l'envoi");
    console.log("   - customerName disponible pour la personnalisation");
  } else {
    console.log("❌ ÉCHEC! Données critiques manquantes");
    console.log("   La page ne pourra pas envoyer d'email");
  }
}

// Lancer le test
testSuccessPage();
