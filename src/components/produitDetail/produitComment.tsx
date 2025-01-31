/** @format */

import Image from "next/image";
import React, { useState } from "react";

interface TabContent {
  title: string;
  content: React.ReactNode;
  
}

export default function ProduitComment() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs: TabContent[] = [
    {
      title: "Description",
      content: (
        <>
          <p className="text-justify">
            Reflétant l{"'"}esprit brut et indomptable du rock {"'"}n{"'"} roll, le
            haut-parleur stéréo portable Kilburn adopte l{"'"}apparence et le son
            emblématiques de Marshall, débranche les câbles et emmène le
            spectacle sur la route.
          </p>
          <p>
            Pesant moins de 7 livres, le Kilburn est une pièce légère
            d{"'"}ingénierie vintage. Étant l{"'"}un des haut-parleurs les plus
            puissants de sa catégorie, le Kilburn est un héros compact et
            robuste avec un son équilibré qui offre des médiums clairs et des
            aigus étendus pour un son à la fois articulé et prononcé. Les
            boutons analogiques vous permettent d{"'"}affiner les réglages selon vos
            préférences personnelles, tandis que la sangle en cuir influencée
            par la guitare permet un transport facile et élégant.
          </p>
        </>
      )
    },
    {
      title: "Informations supplémentaires",
      content: (
        <p>
          Vous pouvez ajouter ici des détails supplémentaires sur le produit
          tels que les matériaux, les dimensions et les informations sur la
          garantie.
        </p>
      )
    },
    {
      title: "Avis [5]",
      content: <p>Les avis et notes des utilisateurs s{"'"}affichent ici.</p>
    }
  ];

  return (
    <div className="product-details-tabs">
      <div className="flex justify-center border-b border-gray-4 tabs">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab-button px-2 py-2 text-gray-3 ${
              activeTab === index
                ? "font-bold text-black border-b-2 border-gray-1"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="p-6 text-gray-700 tab-content">
        {tabs[activeTab].content}
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-2 sm:mt-8 product-images">
        <div className="relative min-w-[283px] min-h-[143px] max-w-[600px] max-h-[600px]">
          <Image
            src="/assets/images/Slide1.png"
            alt="Produit 1"
            layout="responsive"
            width={381}
            height={450}
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="relative min-w-[283px] min-h-[143px] max-w-[600px] max-h-[600px]">
          <Image
            src="/assets/images/Slide1.png"
            alt="Produit 2"
            layout="responsive"
            width={381}
            height={400}
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
