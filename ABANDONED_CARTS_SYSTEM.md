# 🛒 Système de Panier Abandonné - Documentation Complète

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Flux de création](#flux-de-création)
3. [Architecture technique](#architecture-technique)
4. [Étapes détaillées](#étapes-détaillées)
5. [Implémentation](#implémentation)
6. [Gestion après paiement](#gestion-après-paiement)
7. [Dashboard et monitoring](#dashboard-et-monitoring)

---

## Vue d'ensemble

Un **panier abandonné** est un panier contenant des articles que l'utilisateur a laissé sans finaliser son achat. Le système enregistre automatiquement ces paniers dans Firestore pour :

- ✅ Permettre une récupération ultérieure
- ✅ Envoyer des notifications de rappel
- ✅ Analyser le comportement des utilisateurs
- ✅ Identifier les produits abandonnés populaires

### Flux général

```
Utilisateur ajoute des articles
    ↓
Inactivité > 30 minutes
    ↓
Sauvegarde locale (localStorage)
    ↓
Sauvegarde Firestore (panier abandonné)
    ↓
Notification possible
    ↓
Utilisateur revient
    ↓
Récupération du panier
    ↓
Paiement
    ↓
Marquage comme récupéré + suppression
```

---

## Flux de création

### 1. **Initialisation du contexte React**

```typescript
// src/context/cartContext.tsx
const [cart, setCart] = useState<Product[]>([]);

export function CartProvider({ children }: Context) {
  // Le hook useAbandonedCart est utilisé
  // pour tracker les changements de panier
}
```

### 2. **Hook de tracking**

```typescript
// src/hooks/useAbandonedCart.ts
export function useAbandonedCart() {
  const { cart } = useCart();
  const { authUser } = useAuth();
  
  // Appelé automatiquement quand le panier change
  useEffect(() => {
    // Timer 30 min → Sauvegarde Firestore
    setTimeout(() => saveAbandonedCart(), 30 * 60 * 1000);
  }, [cart, authUser]);
}
```

### 3. **Sauvegarde dans Firestore**

```typescript
// src/services/cart/AbandonedCartService.ts
async saveAbandonedCart(cartData): Promise<string> {
  // Crée un document dans "abandonedCarts" collection
  // avec les détails du panier et timestamp
}
```

---

## Architecture technique

### Collections Firestore

```
abandonedCarts (Collection)
├── cartId (Document)
│   ├── userId: "user_123"
│   ├── userEmail: "user@example.com"
│   ├── items: [
│   │   ├── id, nom, src, prix, quantity,
│   │   ├── selectedSize, selectedColor
│   │ ]
│   ├── total: 299.99
│   ├── createdAt: Timestamp(2026-01-16...)
│   ├── lastUpdated: Timestamp(2026-01-16...)
│   ├── reminderSent: false
│   ├── reminderCount: 0
│   ├── recovered: false
│   └── recoveredAt: null
└── ... (autres paniers)
```

### Services impliqués

```
Frontend:
├── CartContext (state du panier React)
├── useAbandonedCart() hook (tracking + sauvegarde locale)
└── AbandonedCartService (Firestore client-side)

Backend:
├── AdminAbandonedCartService (Firestore admin SDK)
├── PaymentManager (récupération après paiement)
└── EmailService (notifications de rappel)
```

---

## Étapes détaillées

### Phase 1: Ajout au panier

```typescript
// Utilisateur clique "Ajouter au panier"
const handleAddToCart = (product) => {
  cartContext.addToCart({
    id: product.id,
    nom: product.nom,
    prix: product.prix,
    quantity: 1,
    // ... autres props
  });
};

// ✅ Le hook useAbandonedCart détecte le changement
// ✅ localStorage est mis à jour : {"items": [...], "timestamp": 1673...}
// ✅ Timer 30 min démarre
```

**Fichier affecté:** `src/context/cartContext.tsx`

### Phase 2: Sauvegarde locale

```typescript
// src/hooks/useAbandonedCart.ts
useEffect(() => {
  if (cart.length === 0) return;
  
  // Sauvegarder en localStorage
  const cartData = {
    items: cart,
    timestamp: Date.now(),
    userId: authUser.uid
  };
  localStorage.setItem("abandonedCart", JSON.stringify(cartData));
  
  // Démarrer le timer 30 minutes
  const timer = setTimeout(() => {
    saveAbandonedCart(); // Vers Firestore
  }, 30 * 60 * 1000);
  
  return () => clearTimeout(timer);
}, [cart, authUser]);
```

**Avantage:** Fonctionne même hors ligne

### Phase 3: Sauvegarde Firestore

```typescript
// src/services/cart/AbandonedCartService.ts
async saveAbandonedCart(cartData) {
  const now = Timestamp.now();
  const cartRef = doc(collection(db, "abandonedCarts"));
  
  const cart = {
    ...cartData,
    id: cartRef.id,
    createdAt: now,
    lastUpdated: now,
    reminderSent: false,
    reminderCount: 0
  };
  
  await setDoc(cartRef, cart);
  return cartRef.id;
}
```

**Détails enregistrés:**
- userId, userEmail
- Items avec détails (prix, quantité, couleur, taille)
- Total du panier
- Timestamps de création

---

## Implémentation

### Pour le frontend (automatique)

```typescript
// 1. Importer le hook dans votre page
import { useAbandonedCart } from "@/hooks/useAbandonedCart";

export default function ShopPage() {
  // 2. Appeler le hook (fonctionne automatiquement)
  useAbandonedCart();
  
  // ... reste du composant
}

// ✅ Pas d'action manuelle requise
// ✅ Suivi automatique quand cart change
// ✅ Sauvegarde locale immédiate
// ✅ Sauvegarde Firestore après 30 min
```

### Pour le backend (admin)

```typescript
// src/services/cart/AdminAbandonedCartService.ts

// Récupérer les paniers abandonnés d'un utilisateur
const carts = await adminAbandonedCartService.getUserAbandonedCarts(userId);

// Marquer un panier comme récupéré
await adminAbandonedCartService.markUserCartsAsRecovered(userId);

// Supprimer tous les paniers d'un utilisateur
await adminAbandonedCartService.clearUserCarts(userId);
```

### Intégration PaymentManager

```typescript
// src/services/payment/PaymentManager.ts

async handlePaymentWebhook(webhookData) {
  // 1. Créer la commande
  const orderId = await adminOrderService.createOrder(orderData);
  
  // 2. Décrémente le stock
  await adminProductService.decrementStocks(items);
  
  // 3. Marque les paniers comme récupérés
  await adminAbandonedCartService.markUserCartsAsRecovered(userId);
  
  // 4. Supprime les paniers de Firestore
  await adminAbandonedCartService.clearUserCarts(userId);
  
  // 5. Envoie email de confirmation
  await emailService.sendOrderConfirmationEmail(emailData);
}
```

---

## Gestion après paiement

### Process automatique

```
Webhook paiement reçu
    ↓
✅ Crée la commande
    ↓
✅ Met à jour le stock
    ↓
✅ Marque le panier comme "recovered: true"
    ↓
✅ Supprime le panier de Firestore
    ↓
✅ Vide le panier React (frontend)
    ↓
✅ Envoie email de confirmation
```

### Fichiers concernés

1. **Backend:**
   - `src/services/payment/PaymentManager.ts` (orchestration)
   - `src/services/cart/AdminAbandonedCartService.ts` (suppression)
   - `src/services/dashboard/AdminOrderService.ts` (création commande)

2. **Frontend:**
   - `src/pages/checkout/success/index.tsx` (vide le cart React)
   - `src/context/cartContext.tsx` (removeCartItem)

### Code d'exemple - Suppression après paiement

```typescript
// src/services/cart/AdminAbandonedCartService.ts
async clearUserCarts(userId: string): Promise<void> {
  const db = getAdminDb();
  
  // Récupère tous les paniers de l'utilisateur
  const snapshot = await db
    .collection("abandonedCarts")
    .where("userId", "==", userId)
    .get();
  
  // Supprime chaque panier
  const deletePromises = snapshot.docs.map((doc) =>
    db.collection("abandonedCarts").doc(doc.id).delete()
  );
  
  await Promise.all(deletePromises);
  console.log(`✅ ${snapshot.docs.length} panier(s) supprimé(s)`);
}
```

---

## Dashboard et monitoring

### Collecter les métriques

```typescript
// Exemple de script pour analyser les paniers abandonnés
async function getAbandonedCartsStats() {
  const db = getAdminDb();
  
  const snapshot = await db
    .collection("abandonedCarts")
    .where("recovered", "!=", true)
    .get();
  
  const stats = {
    totalAbandoned: snapshot.docs.length,
    totalValue: snapshot.docs.reduce((sum, doc) => sum + doc.data().total, 0),
    byProduct: analyzeProducts(snapshot.docs),
    byUser: analyzeUsers(snapshot.docs)
  };
  
  return stats;
}
```

### Cas d'usage

#### 1. **Email de rappel automatique**

```typescript
// Envoyer un reminder après 24 heures
if (cart.lastUpdated < now - 24 * 60 * 60 * 1000) {
  await emailService.sendAbandonedCartReminder(
    cart.userEmail,
    cart.total,
    `${process.env.APP_URL}/cart?cartId=${cart.id}`
  );
  
  // Marquer reminder comme envoyé
  await cartRef.update({
    reminderSent: true,
    reminderCount: increment(1),
    reminderSentAt: now
  });
}
```

#### 2. **Analyse des produits abandonnés**

```typescript
// Quels produits sont les plus abandonnés?
const abandonedProducts = snapshot.docs
  .flatMap(doc => doc.data().items)
  .reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + item.quantity;
    return acc;
  }, {});

console.log("Produits les plus abandonnés:", abandonedProducts);
```

#### 3. **Récupération de paniers**

```typescript
// Quand l'utilisateur revient, récupérer son panier
const recoveryUrl = `${APP_URL}/recover-cart?cartId=${cartId}`;

// Ou automatiquement si connecté
const carts = await getUserAbandonedCarts(userId);
if (carts.length > 0) {
  // Afficher notification "Reprendre votre achat"
}
```

---

## Timestamps

```typescript
// Format des timestamps dans Firestore
{
  createdAt: Timestamp { seconds: 1673900400, nanoseconds: 0 },
  lastUpdated: Timestamp { seconds: 1673900405, nanoseconds: 500000000 },
  recoveredAt: Timestamp { seconds: 1673987805, nanoseconds: 0 }
}

// Conversion
const date = timestamp.toDate(); // → Date object
```

---

## Bonnes pratiques

### ✅ À faire

- ✅ Nettoyer les vieux paniers abandonnés (> 90 jours)
- ✅ Envoyer des reminders progressifs (1j, 3j, 7j)
- ✅ Analyser les raisons d'abandon
- ✅ Tracker les conversions depuis paniers récupérés
- ✅ Tester le flow complet avec `npm run test:full-webhook`

### ❌ À éviter

- ❌ Ne pas garder les paniers éternellement
- ❌ Ne pas spammer avec des reminders
- ❌ Ne pas effacer avant que le panier soit marqué "recovered"
- ❌ Ne pas mesurer success rate sans donnée

---

## Test complet

```bash
# Tester tout le pipeline
npm run test:full-webhook

# Log attendu:
# ✅ Commande créée: abc123
# ✅ Stock mis à jour: 8 -> 7
# ✅ AdminAbandonedCartService chargé
# ✅ Panier(s) supprimé(s) pour l'utilisateur... (0 panier(s))
# ✅ SUCCÈS! Webhook traité correctement!
```

---

## Résumé

| Étape | Service | Fichier | Action |
|-------|---------|---------|--------|
| 1 | CartContext | `cartContext.tsx` | Ajoute article |
| 2 | useAbandonedCart | `useAbandonedCart.ts` | Sauvegarde locale |
| 3 | AbandonedCartService | `AbandonedCartService.ts` | Sauvegarde Firestore |
| 4 | PaymentManager | `PaymentManager.ts` | Récupère après paiement |
| 5 | AdminAbandonedCartService | `AdminAbandonedCartService.ts` | Marque/supprime |
| 6 | Success page | `success/index.tsx` | Vide le panier React |

---

## Questions fréquentes

**Q: Pourquoi 30 minutes?**
A: C'est un délai standard pour identifier les abandons réels vs inactivité brève.

**Q: Les paniers sont-ils synchronisés entre appareils?**
A: Non, ils sont basés sur userId. L'utilisateur peut reprendre depuis n'importe quel appareil.

**Q: Que se passe-t-il si l'utilisateur quitte avant 30 min?**
A: Le panier reste en localStorage et sera sauvegardé au prochain accès ou après 30 min.

**Q: Peut-on modifier le délai?**
A: Oui, dans `useAbandonedCart.ts`, changez `CART_ABANDONMENT_DELAY`.

