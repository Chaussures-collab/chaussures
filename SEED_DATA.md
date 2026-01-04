# Guide de Seeding des Données Mockées

Ce guide explique comment importer les données mockées (produits et catégories) dans votre base de données Firestore.

## 📋 Prérequis

- Avoir configuré Firebase et Firestore
- Avoir accès au dashboard (`/dashboard`)

## 🚀 Utilisation

### Méthode 1 : Via le Dashboard (Recommandé)

1. Accédez au dashboard : `/dashboard`
2. Dans la section "Actions rapides", cliquez sur le bouton **"Importer les données mockées"**
3. Attendez la confirmation d'importation
4. Les produits et catégories mockés seront ajoutés à votre base de données Firestore

### Méthode 2 : Via l'API directement

Vous pouvez également appeler l'API directement :

```bash
curl -X POST http://localhost:3000/api/seed-data \
  -H "Content-Type: application/json" \
  -d '{"secret": "votre-secret-si-configuré"}'
```

## 🔒 Sécurité

Pour sécuriser l'endpoint en production, ajoutez une variable d'environnement :

```env
SEED_SECRET=votre-clé-secrète-ici
```

Si `SEED_SECRET` n'est pas défini, l'endpoint est accessible sans authentification (utile pour le développement).

## 📊 Données importées

### Catégories
- Toutes les catégories depuis `src/components/home/categorie/categorieDB.tsx`
- Vérification des doublons : les catégories existantes ne seront pas recréées

### Produits
- Tous les produits depuis `src/components/home/produits/produitsDB.tsx`
- Inclut :
  - Informations de base (nom, description, prix, etc.)
  - Images (principale + images secondaires)
  - Couleurs disponibles
  - Tailles disponibles
  - Stock et promotions
- Vérification des doublons : les produits existants (par nom) ne seront pas recréés

## ⚠️ Notes importantes

1. **Doublons** : Le script vérifie automatiquement si un produit ou une catégorie existe déjà avant de le créer
2. **Idempotence** : Vous pouvez exécuter le script plusieurs fois sans créer de doublons
3. **Erreurs** : Les erreurs individuelles n'arrêtent pas le processus, elles sont collectées et affichées à la fin
4. **Performance** : Pour un grand nombre de produits, le processus peut prendre quelques minutes

## 🔍 Vérification

Après l'importation, vous pouvez vérifier les données :
- Dans le dashboard : `/dashboard/produits` et `/dashboard/categories`
- Dans Firestore : Collections `products` et `categories`

## 🛠️ Dépannage

### Erreur "Unauthorized"
- Vérifiez que `SEED_SECRET` correspond si vous l'avez configuré
- En développement, vous pouvez laisser `SEED_SECRET` non défini

### Erreurs de création
- Vérifiez que Firestore est correctement configuré
- Vérifiez les règles de sécurité Firestore
- Consultez les logs de la console pour plus de détails

