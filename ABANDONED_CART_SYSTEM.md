# Système de Relance Panier Abandonné

## 📋 Vue d'ensemble

Le système de relance panier abandonné permet d'envoyer automatiquement des emails aux clients qui ont laissé des articles dans leur panier sans finaliser leur commande.

## ⏰ Quand les paniers sont-ils relancés ?

### Déclenchement automatique

Les paniers sont relancés selon les critères suivants :

1. **Délai d'abandon** : Un panier est considéré comme "abandonné" après **30 minutes** d'inactivité
2. **Délai de relance** : Les paniers sont relancés après **24 heures** d'abandon (configurable)
3. **Fréquence** : Les relances doivent être déclenchées via un cron job ou une fonction planifiée

### Configuration

- **Délai d'abandon** : Défini dans `src/hooks/useAbandonedCart.ts` (actuellement 30 minutes)
- **Délai de relance** : Défini dans l'API `/api/abandoned-carts/remind` (par défaut 24 heures, modifiable via paramètre `?hours=24`)

## 🔧 Mise en place

### 1. Configuration du Cron Job

Pour automatiser les relances, configurez un cron job qui appelle l'endpoint API :

```bash
# Exemple : Relance tous les jours à 10h00
0 10 * * * curl -X POST https://votre-domaine.com/api/abandoned-carts/remind?key=VOTRE_CLE_SECRETE
```

### 2. Variable d'environnement

Ajoutez une clé secrète dans votre fichier `.env` :

```env
ABANDONED_CART_API_KEY=votre_cle_secrete_ici
```

### 3. Utilisation manuelle

Vous pouvez aussi déclencher manuellement les relances en appelant :

```bash
POST /api/abandoned-carts/remind?key=VOTRE_CLE_SECRETE&hours=24
```

## 📊 Fonctionnement

### Sauvegarde automatique

- Le panier est automatiquement sauvegardé dans Firestore après 30 minutes d'inactivité
- Le panier est aussi sauvegardé dans localStorage pour persistance entre sessions

### Relance

1. Le système récupère tous les paniers abandonnés depuis plus de X heures
2. Pour chaque panier :
   - Un email de relance est envoyé au client
   - Le panier est marqué comme "relancé"
   - Le compteur de relances est incrémenté

### Récupération

Quand un client finalise sa commande :
- Le panier est automatiquement marqué comme "récupéré"
- Il ne sera plus relancé

## 📧 Contenu de l'email de relance

L'email contient :
- Liste des articles dans le panier
- Prix total
- Lien direct vers le panier pour finaliser la commande

## 🔒 Sécurité

- L'endpoint de relance nécessite une clé API secrète
- Seuls les utilisateurs authentifiés peuvent créer/mettre à jour leurs paniers abandonnés
- Les règles Firestore protègent l'accès aux données

## 📝 Règles Firestore

Les règles pour `abandonedCarts` sont définies dans `firestore.rules` :

```javascript
match /abandonedCarts/{cartId} {
  allow read: if isUserAuthenticated();
  allow create: if isUserAuthenticated();
  allow update, delete: if isUserAuthenticated();
}
```

## 🚀 Prochaines étapes

Pour activer complètement le système :

1. ✅ Règles Firestore ajoutées
2. ✅ Service de relance créé
3. ✅ API endpoint créé
4. ⏳ Configurer le cron job (à faire manuellement selon votre hébergement)
5. ⏳ Ajouter la variable d'environnement `ABANDONED_CART_API_KEY`

