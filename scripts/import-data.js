/**
 * Script pour importer les données mockées dans Firestore
 * Usage: node scripts/import-data.js
 */

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/import-data',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

console.log('🚀 Démarrage de l\'importation des données...\n');

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ Importation réussie!\n');
        console.log(`📦 ${result.productsCreated || 0} produits créés`);
        console.log(`📁 ${result.categoriesCreated || 0} catégories créées\n`);
        
        if (result.errors && result.errors.length > 0) {
          console.log(`⚠️  ${result.errors.length} erreur(s):\n`);
          result.errors.forEach((error, index) => {
            console.log(`${index + 1}. ${error}`);
          });
        }
      } else {
        console.error('❌ Erreur lors de l\'importation:', result.message);
        if (result.errors) {
          result.errors.forEach((error) => {
            console.error('  -', error);
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la lecture de la réponse:', error.message);
      console.log('Réponse brute:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erreur de connexion:', error.message);
  console.error('\n💡 Assurez-vous que le serveur Next.js est en cours d\'exécution (npm run dev)');
});

req.write(JSON.stringify({}));
req.end();

