/** @format */

export interface Review {
  id: string;
  author: string;
  rating: number; // Entre 4 et 5
  comment: string;
  date: string;
  verified: boolean;
}

// Noms d'auteurs variés
const authorNames = [
  "Sophie Martin",
  "Thomas Dubois",
  "Marie Leroy",
  "Jean Dupont",
  "Camille Bernard",
  "Lucas Moreau",
  "Emma Rousseau",
  "Antoine Girard",
  "Léa Petit",
  "Maxime Durand",
  "Julie Lambert",
  "Pierre Simon",
  "Clara Vincent",
  "Nicolas Lefebvre",
  "Sarah Michel",
  "Alexandre Garcia",
  "Manon Roux",
  "Hugo Fournier",
  "Inès Girard",
  "Louis Mercier"
];

// Commentaires variés mais positifs - enrichis pour plus de diversité
const reviewComments = [
  "Excellent produit ! Qualité au rendez-vous et livraison rapide. Je recommande vivement.",
  "Très satisfait de mon achat. Le produit correspond parfaitement à la description. Service client impeccable.",
  "Produit de qualité supérieure. Je suis ravi de mon choix et n'hésiterai pas à recommander.",
  "Superbe qualité, finition soignée. Un excellent rapport qualité-prix. Livraison dans les temps.",
  "Parfait ! Le produit dépasse mes attentes. Très bon service et emballage soigné.",
  "Excellent achat, je suis très content. La qualité est au rendez-vous et le design est moderne.",
  "Produit conforme à mes attentes. Bonne qualité et livraison rapide. Je recommande sans hésitation.",
  "Très bon produit, je suis satisfait. La qualité est excellente pour le prix demandé.",
  "Excellent rapport qualité-prix. Le produit est solide et bien conçu. Livraison rapide.",
  "Super produit ! Qualité irréprochable et service client réactif. Je suis très satisfait.",
  "Produit de très bonne qualité. Conforme à la description et livraison dans les délais.",
  "Excellent achat ! Le produit est de qualité et répond parfaitement à mes besoins.",
  "Très satisfait, produit de qualité. Bonne finition et design soigné. Je recommande.",
  "Parfait produit, qualité au top. Service client professionnel et livraison rapide.",
  "Excellent ! Le produit est de très bonne qualité et correspond exactement à mes attentes.",
  "Superbe qualité, je suis ravi. Le produit est solide et bien conçu. Très bon service.",
  "Produit de qualité supérieure. Excellent rapport qualité-prix et livraison dans les temps.",
  "Très bon produit, je recommande. Qualité irréprochable et service client au top.",
  "Excellent achat, qualité remarquable. Le produit dépasse mes attentes. Livraison rapide.",
  "Parfait ! Produit de très bonne qualité. Conforme à la description et bien emballé.",
  "Très bon rapport qualité-prix. Le produit est robuste et durable. Je suis content de mon achat.",
  "Qualité supérieure à ce que j'espérais. Design élégant et finitions impeccables. Livraison express !",
  "Produit de grande qualité, je suis impressionné. Correspond exactement à la photo. Service parfait.",
  "Excellent ! Très satisfait de la qualité et du design. Le produit est solide et bien pensé.",
  "Superbe achat ! Qualité premium et livraison rapide. Je recommande sans hésiter ce produit.",
  "Produit de très bonne facture. La qualité est au rendez-vous et le prix est compétitif.",
  "Très content de mon achat. Le produit est de qualité et répond parfaitement à mes attentes.",
  "Excellent produit, qualité irréprochable. Design moderne et finitions soignées. Je recommande !",
  "Parfait achat ! Le produit est de très bonne qualité et le service client est réactif.",
  "Très satisfait, produit de qualité supérieure. Bonne finition et livraison dans les délais.",
  "Excellent rapport qualité-prix. Le produit est solide, bien conçu et correspond à la description.",
  "Super produit ! Qualité au top et livraison rapide. Je suis très content de mon achat.",
  "Produit de qualité, je recommande. Très bon service et emballage soigné. Parfait !",
  "Très bon produit, qualité excellente. Le design est moderne et la finition soignée.",
  "Excellent ! Produit de très bonne qualité qui dépasse mes attentes. Service impeccable."
];

/**
 * Génère un hash simple à partir d'une chaîne
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Génère un nombre pseudo-aléatoire basé sur un seed
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Génère des avis variés mais élevés (4-5 étoiles) pour un produit
 * Les avis sont déterministes basés sur l'ID du produit pour la cohérence
 * Distribution améliorée pour plus de variété : 15% 4.0, 25% 4.5, 60% 5.0
 */
// Type temporaire pour le tri avec timestamp
type ReviewWithTimestamp = Review & { _sortTimestamp: number };

export function generateReviewsForProduct(productId: string, count: number = 12): Review[] {
  const seed = hashString(productId);
  const reviewsWithTimestamp: ReviewWithTimestamp[] = [];
  
  // Générer un nombre d'avis entre 10 et 15 pour plus de variété
  const numReviews = Math.min(count, 15);
  
  // Utiliser un Set pour éviter les doublons d'auteurs dans la même liste
  const usedAuthorIndices = new Set<number>();
  const usedCommentIndices = new Set<number>();
  
  for (let i = 0; i < numReviews; i++) {
    const reviewSeed = seed + i * 1000;
    
    // Distribution améliorée des notes pour plus de variété
    // 15% chance d'avoir 4.0, 25% chance d'avoir 4.5, 60% chance d'avoir 5.0
    let rating: number;
    const ratingRandom = seededRandom(reviewSeed + 1);
    if (ratingRandom < 0.15) {
      // 15% chance d'avoir 4.0
      rating = 4.0;
    } else if (ratingRandom < 0.40) {
      // 25% chance d'avoir 4.5
      rating = 4.5;
    } else {
      // 60% chance d'avoir 5.0
      rating = 5.0;
    }
    
    // Sélectionner un auteur unique basé sur le seed
    let authorIndex: number;
    let attempts = 0;
    do {
      authorIndex = Math.floor(seededRandom(reviewSeed + 2 + attempts) * authorNames.length);
      attempts++;
      // Si on a utilisé tous les auteurs, réinitialiser le Set
      if (usedAuthorIndices.size >= authorNames.length) {
        usedAuthorIndices.clear();
      }
    } while (usedAuthorIndices.has(authorIndex) && attempts < 10);
    usedAuthorIndices.add(authorIndex);
    const author = authorNames[authorIndex];
    
    // Sélectionner un commentaire unique basé sur le seed
    let commentIndex: number;
    attempts = 0;
    do {
      commentIndex = Math.floor(seededRandom(reviewSeed + 3 + attempts) * reviewComments.length);
      attempts++;
      // Si on a utilisé tous les commentaires, réinitialiser le Set
      if (usedCommentIndices.size >= reviewComments.length) {
        usedCommentIndices.clear();
      }
    } while (usedCommentIndices.has(commentIndex) && attempts < 10);
    usedCommentIndices.add(commentIndex);
    const comment = reviewComments[commentIndex];
    
    // Générer une date variée (dans les 90 derniers jours pour plus de réalisme)
    const daysAgo = Math.floor(seededRandom(reviewSeed + 4) * 90);
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - daysAgo);
    
    // Convertir la date en format français
    const dateString = dateObj.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
    
    // 75% des avis sont vérifiés (légèrement réduit pour plus de réalisme)
    const verified = seededRandom(reviewSeed + 5) < 0.75;
    
    reviewsWithTimestamp.push({
      id: `review-${productId}-${i}`,
      author,
      rating,
      comment,
      date: dateString,
      verified,
      _sortTimestamp: dateObj.getTime()
    });
  }
  
  // Trier les avis par date (plus récents en premier) pour un meilleur affichage
  reviewsWithTimestamp.sort((a, b) => {
    return b._sortTimestamp - a._sortTimestamp;
  });
  
  // Convertir en Review[] en supprimant la propriété temporaire _sortTimestamp
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return reviewsWithTimestamp.map(({ _sortTimestamp, ...review }) => review);
}

/**
 * Calcule la note moyenne d'un produit basée sur ses avis
 */
export function calculateAverageRating(productId: string): number {
  const reviews = generateReviewsForProduct(productId);
  if (reviews.length === 0) return 4.5;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;
  
  // Arrondir à 0.5 près
  return Math.round(average * 2) / 2;
}

/**
 * Obtient le nombre total d'avis pour un produit
 */
export function getTotalReviewsCount(productId: string): number {
  // Générer un nombre d'avis réaliste entre 50 et 500
  const seed = hashString(productId);
  const random = seededRandom(seed + 100);
  return Math.floor(50 + random * 450);
}

