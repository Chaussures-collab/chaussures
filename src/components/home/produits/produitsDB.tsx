
/* export const dbProduits = [
  {
    id: 1,
    src: "/images/product-1.jpg",
    alt: "Product 1",
    prix: 100,
    nom: "Produit 1",
    categorie: "Catégorie A",
    dateAjout: "2024-01-01",
    description: "Description du produit 1",
    description1: "Description courte",
    promotion: 15,
    images: [{ src: "/images/product-1-1.jpg", alt: "Image 1" }],
    colors: [{ id: 1, name: "Red", hex: "#FF0000" }],
    sizes: ["S", "M", "L"]
  },
  // Autres produits...
]; */

import { ProduitType } from "@/types/produitType";




  export const dbProduits:ProduitType[]  = [
  // Produits récents
  {
    id: 1,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "Alternative",
    dateAjout: "2024-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 2,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "ALiments",
    dateAjout: "2025-01-23T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 3,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "Chaussure",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 4,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "Chaussure",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 5,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "Chaussure",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 6,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "ALiments",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 7,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "ALiments",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 8,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "ALiments",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 9,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 10,
    src: "/assets/images/Slide1.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  },
  {
    id: 12,
    src: "/assets/images/Slide3.png",
    alt: "Slide 1",
    prix: 15000,
    nom: "Produit 1",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Slide1.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Slide2.jpg", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Slide3.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Slide4.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["40", "37", "52"]
  }
  // Continuez de cette manière pour tous les autres produits...
]; 
