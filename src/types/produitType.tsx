/** @format */


export interface ProduitTypes{
  id: number;
  src: string;
  alt: string;
  prix: number;
  nom: string;
  categorie: string;
  dateAjout: string;
  description: string;
  description1: string;
  quantity?: number;//quantiteStock
  promotion?: number;//prixPromo
  images: { id:number; src: string; alt: string }[];
  colors: { id: number; name: string; code: string }[];
  sizes: string[];
  selectedColor?: string;
  selectedSize?: string | number;
  size?: string; // Cette propriété doit être présente
};
export interface ProduitType{
  prix: number;
  nom: string;
  description: string;
  description1: string;
  quantiteStock?: number;//quantiteStock
  prixPromo?: number | null;//prixPromo
};
