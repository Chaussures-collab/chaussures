/** @format */

export interface ProduitType {
  id: string;
  src: string;
  alt: string;
  prix: number;
  nom: string;
  categorie: string;
  dateAjout: string;
  description: string;
  description1: string;
  quantity?: number; //quantiteStock
  promotion?: string | number | null;
  //prixPromo
  images: { id: number; src: string; alt: string }[];
  colors: { id: number; name: string; code: string }[];
  sizes: string[];
  selectedColor?: string;
  selectedSize?: string | number;
  size?: string; // Cette propriété doit être présente
  quantiteStock?: number; //quantiteStock
  prixPromo?: number | null; //prixPromo
}
export interface ProduitTypes {
  prix: number;
  nom: string;
  description: string;
  description1: string;
  quantiteStock?: number; //quantiteStock
  prixPromo?: number | null; //prixPromo
}
