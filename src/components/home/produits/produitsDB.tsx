
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

//import { ProduitType } from "@/types/produitType";




  export const dbProduits  = [
  // Produits récents
  {
    id: 1,
    src: "/assets/images/CHAUSSURES/AIR_NIKE3.png",
    alt: "Slide 1",
    prix: 50,
    nom: "AIR NIKE",
    categorie: "Chaussures",
    dateAjout: "2024-02-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit de meilleurs quantitée",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 45,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/AIR_NIKE3.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/AIR_NIKE4.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/AIR_NIKE5.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/CHAUSSURES/AIR_NIKE2.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Noire", code: "#211C1CFF" },
      {id: 2, name: "Bleu", code: "#0000FF" },
      {id: 3, name: "Blanc", code: "#FFFFFF" },
      {id: 4, name: "Marron", code: "#CDC6B4C7" },
    ],
    sizes: ["36", "37", "38", "39"]
  },
  {
    id: 2,
    src: "/assets/images/CHAUSSURES/AIR_NIKE13.png",
    alt: "Slide 1",
    prix: 70,
    nom: "AIR NIKE",
    categorie: "Chaussures",
    dateAjout: "2025-02-23T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 50,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/AIR_NIKE12.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/AIR_NIKE13.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/AIR_NIKE14.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/CHAUSSURES/AIR_NIKE11.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Noire", code: "#211C1CFF" },
      { id:2,name: "Blanc", code: "#FFFFFF" },
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  {
    id: 3,
    src: "/assets/images/CHAUSSURES/AIR_NIKE16.png",
    alt: "Slide 1",
    prix: 45,
    nom: "AIR NIKE",
    categorie: "Chaussures",
    dateAjout: "2025-02-5T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/AIR_NIKE17.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/AIR_NIKE2.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/AIR_NIKE2.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/CHAUSSURES/AIR_NIKE2.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  {
    id: 4,
    src: "/assets/images/CHAUSSURES/AIR_MAX21.png",
    alt: "Slide 1",
    prix: 60,
    nom: "AIR MAX",
    categorie: "Chaussure",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/AIR_MAX22.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/AIR_MAX23.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/AIR_MAX24.png", alt: "Image 3 description" },
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  {
    id: 5,
    src: "/assets/images/CHAUSSURES/AIR_MAX26.png",
    alt: "Slide 1",
    prix: 55,
    nom: "AIR MAX",
    categorie: "Chaussure",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/AIR_MAX26.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/AIR_MAX27.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/AIR_MAX28.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images//CHAUSSURES/AIR_MAX29.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  {
    id: 6,
    src: "/assets/images/CHAUSSURES/AIR_NIKE15.png",
    alt: "Slide 1",
    prix: 55,
    nom: "AIR NIKE",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/AIR_NIKE14.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/AIR_NIKE12.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
  },
  {
    id: 7,
    src: "/assets/images/CHAUSSURES/Botte_UGG81.png",
    alt: "Slide 1",
    prix: 66.99,
    nom: "Botte UGG",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/Botte_UGG82.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/Botte_UGG83.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/Botte_UGG81.png", alt: "Image 3 description" },
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
  },
  {
    id: 8,
    src: "/assets/images/CHAUSSURES/Botte_UGG111.png",
    alt: "Botte UGG",
    prix: 65,
    nom: "Botte UGG",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/Botte_UGG112.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/Botte_UGG113.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/Botte_UGG83.png", alt: "Image 3 description" },
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
  },
  {
    id: 9,
    src: "/assets/images/CHAUSSURES/Botte_UGG122.png",
    alt: "Slide 1",
    prix: 105,
    nom: "Botte UGG",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    promotion: 90,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/Botte_UGG121.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/Botte_UGG122.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/Botte_UGG122.png", alt: "Image 3 description" },
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
  },
  {
    id: 10,
    src: "/assets/images/CHAUSSURES/mini_Botte_UGG91.png",
    alt: "Slide 1",
    prix: 60,
    nom: "Mini Botte UGG",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/mini_Botte_UGG91.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/mini_Botte_UGG92.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/mini_Botte_UGG93.png", alt: "Image 3 description" },
      { id:4,src: "/assets/CHAUSSURES/mini_Botte_UGG94.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
  },
  {
    id: 11,
    src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly51.png",
    alt: "Slide 1",
    prix: 80,
    nom: "Nike Mercurial Superfly",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly52.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly53.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly51.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly54.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
  },
  {
    id: 12,
    src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly54.png",
    alt: "Slide 1",
    prix: 80,
    nom: "Nike Mercurial Superfly",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly54.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly41.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/Nike_Mercurial_Superfly53.png", alt: "Image 3 description" },
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]
  },
  {
    id: 13,
    src: "/assets/images/CHAUSSURES/NIKE_Pegasus31.png",
    alt: "Slide 1",
    prix: 65,
    nom: "NIKE Pegasus",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/NIKE_Pegasus31.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/NIKE_Pegasus32.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/NIKE_Pegasus33.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/CHAUSSURES/NIKE_Pegasus.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  {
    id: 14,
    src: "/assets/images/CHAUSSURES/NIKE_TN61.png",
    alt: "Slide 1",
    prix: 60,
    nom: "NIKE TN",
    categorie: "Chaussures",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/NIKE_TN61.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/NIKE_TN62.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/NIKE_TN63.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/CHAUSSURES/NIKE_TN64.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  {
    id: 15,
    src: "/assets/images/CHAUSSURES/NIKE_TN67.png",
    alt: "Slide 1",
    prix: 60,
    nom: "NIKE TN",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/NIKE_TN66.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/NIKE_TN67.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/NIKE_TN65.png", alt: "Image 3 description" },
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  
  {
    id: 16,
    src: "/assets/images/CHAUSSURES/UGG71.png",
    alt: "Slide 1",
    prix: 55,
    nom: "UGG",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/CHAUSSURES/UGG71.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/CHAUSSURES/UGG71.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/CHAUSSURES/UGG71.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/CHAUSSURES/UGG71.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["37","38", "39", "40", "41", "42", "43", "44", "45", "46", "47"]

  },
  {
    id: 17,
    src: "/assets/images/Survetement/Doudoune sans manches Tibb_Moncler72.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Doudoune sans manches Tibb_Moncler71",
    categorie: "Doudoune",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Doudoune sans manches Tibb_Moncler71.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Doudoune sans manches Tibb_Moncler72.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Noire", code: "#000000" },
      {id: 2, name: "Blanc", code: "#ffffff" },
    ],
    sizes: ["L","S", "XL", "XXL"]

  },
  {
    id: 18,
    src: "/assets/images/Survetement/Doudoune_courte_Tarn_Moncler&.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Doudoune courte Tarn Moncler",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Doudoune_courte_Tarn_Moncler&.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Doudoune_courte_Tarn_Moncler.png", alt: "Image 2 description" },
      
    ],
    colors: [
      { id:1,name: "Noire", code: "#000000" },
      {id: 2, name: "Blanc", code: "#ffffff" },
    ],
    sizes: ["L","S", "XL", "XXL"]

  },
  {
    id: 19,
    src: "/assets/images/Survetement/Survetement_Adidas44.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Survetement Adidas",
    categorie: "Survetement",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Survetement_Adidas41.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Survetement_Adidas42.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Survetement/Survetement_Adidas43.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Survetement/Survetement_Adidas44.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Noire", code: "#000000" },
      {id: 2, name: "Blanc", code: "#ffffff" },
      { id:3,name: "Rouge", code: "#8C9188FF" },
      {id: 4, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["L","S", "XL", "XXL"]

  },
  {
    id: 20,
    src: "/assets/images/Survetement/Survetement_Hilfiger51.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Survetement Hilfiger",
    categorie: "Alternative",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Survetement_Hilfiger51.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Survetement_Hilfiger52.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Noire", code: "#000000" },
      {id: 2, name: "Blanc", code: "#ffffff" },
    ],
    sizes: ["L","S", "XL", "XXL"]

  },
  {
    id: 21,
    src: "/assets/images/Survetement/Survetement_Kappa61.png",
    alt: "Slide 1",
    prix: 55,
    nom: "UGG",
    categorie: "Survetement",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Survetement_Kappa61.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Survetement_Kappa62.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Survetement/Survetement_Kappa63.png", alt: "Image 3 description" },
    ],
    colors: [
      { id:1,name: "Blanc", code: "#FFFFFF" },
      {id: 2, name: "vert", code: "#2CA096FF" },
      { id:3,name: "Blanc", code: "#E7E5E5FF" },
    ],
    sizes: ["L","S", "XL", "XXL"]

  },
  {
    id: 22,
    src: "/assets/images/Survetement/Survetement_nike11.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Survetement nike",
    categorie: "Survetement",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Survetement_nike11.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Survetement_nike12.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Survetement/Survetement_nike13.png", alt: "Image 3 description" },
      { id:4,src: "/assets/images/Survetement/Survetement_nike14.png", alt: "Image 4 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
      { id:3,name: "bleu-clair", code: "#2F378BFF" },
      {id: 4, name: "Bleu-ciel", code: "#292969FF" },
    ],
    sizes: ["L","S", "XL", "XXL"]
  },
  {
    id: 23,
    src: "/assets/images/Survetement/Survetement_nike21.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Survetement nike",
    categorie: "Survetement",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Survetement_nike21.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Survetement_nike2.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#FF0000" },
      {id: 2, name: "Bleu", code: "#0000FF" },
    ],
    sizes: ["L","S", "XL", "XXL"]
  },
  {
    id: 24,
    src: "/assets/images/Survetement/Survetement_Track31.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Survetement track",
    categorie: "Survetement",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Survetement_Track31.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Survetement_Track32.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Survetement/Survetement_Track33.png", alt: "Image 2 description" },
      { id:4,src: "/assets/images/Survetement/Survetement_Track34.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#883030FF" },
      {id: 2, name: "Noir", code: "#0F0F13FF" },
      {id: 3, name: "Noir", code: "#433E49FF" },
      {id: 4, name: "Noir", code: "#6B6C75FF" },
    ],
    sizes: ["L","S", "XL", "XXL"]
  },
  {
    id: 25,
    src: "/assets/images/Survetement/Survetement_Track35.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Survetement track",
    categorie: "Survetement",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Survetement_Track36.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Survetement_Track37.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Survetement/Survetement_Track35.png", alt: "Image 2 description" },
      { id:4,src: "/assets/images/Survetement/Survetement_Track32.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#151212FF" },
      {id: 2, name: "Noir", code: "#4545EEFF" },
      {id: 3, name: "Noir", code: "#77658DFF" },
      {id: 4, name: "Noir", code: "#DFE0EBFF" },
    ],
    sizes: ["L","S", "XL", "XXL"]
  },
  {
    id: 26,
    src: "/assets/images/Survetement/Veste_d'hiver41.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Veste d'hiver",
    categorie: "Veste",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Veste_d'hiver42.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Veste_d'hiver43.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Survetement/Veste_d'hiver41.png", alt: "Image 2 description" },
      { id:4,src: "/assets/images/Survetement/Veste_d'hiver44.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#E33939FF" },
      {id: 2, name: "Noir", code: "#4545EEFF" },
      {id: 3, name: "Noir", code: "#77658DFF" },
      {id: 4, name: "Noir", code: "#0D0D0FFF" },
    ],
    sizes: ["L","S", "XL", "XXL"]
  },
  {
    id: 27,
    src: "/assets/images/Survetement/Veste_d'hiver45.png",
    alt: "Slide 1",
    prix: 55,
    nom: "Veste d'hiver",
    categorie: "Veste",
    dateAjout: "2025-01-10T12:00:00Z", // Produit ajouté il y a 7 jours
    description: "Produit récent",
    description1:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eligendi totam fugit, esse ex nostrum facere minus. Reprehenderit laborum eius illo.",
    //promotion: 7500,
    images: [
      { id:1,src: "/assets/images/Survetement/Veste_d'hiver45.png", alt: "Image 1 description" },
      { id:2,src: "/assets/images/Survetement/Veste_d'hiver46.png", alt: "Image 2 description" },
      { id:3,src: "/assets/images/Survetement/Veste_d'hiver44.png", alt: "Image 2 description" },
      { id:4,src: "/assets/images/Survetement/Veste_d'hiver41.png", alt: "Image 2 description" }
    ],
    colors: [
      { id:1,name: "Rouge", code: "#F3EEEEFF" },
      {id: 2, name: "Noir", code: "#4545EEFF" },
      {id: 3, name: "Noir", code: "#77658DFF" },
      {id: 4, name: "Noir", code: "#0D0D0FFF" },
    ],
    sizes: ["L","S", "XL", "XXL"]
  },
]; 
