/** @format */

/**
 * Normalise un chemin d'image pour Next.js
 * Les chemins relatifs doivent commencer par "/" ou être des URLs absolutes
 * @param src - Le chemin de l'image
 * @returns Le chemin normalisé
 */
export function normalizeImagePath(src: string | undefined | null): string {
  if (!src) {
    return "/assets/images/placeholder.png"; // Image par défaut
  }

  // Si c'est déjà une URL absolue (http:// ou https://), retourner tel quel
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  // Normaliser le chemin
  let normalized = src;
  
  // Si le chemin ne commence pas par "/", l'ajouter
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  // Normaliser la casse de l'extension pour les fichiers WEBP
  // Convertir .webp en .WEBP pour correspondre aux fichiers réels
  normalized = normalized.replace(/\.webp$/i, ".WEBP");

  return normalized;
}

