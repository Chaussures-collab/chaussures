/** @format */

import Image from "next/image";
import React, { useState } from "react";

interface TabContent {
  title: string;
  content: React.ReactNode;
}
interface Props{
  src: string;
  alt: string;
}

export default function ProduitComment({src, alt}:Props) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs: TabContent[] = [
    {
      title: "Description",
      content: (
        <>
          <p className="text-justify">
            Découvrez une large sélection de produits de qualité, soigneusement
            choisis pour répondre à tous vos besoins. Chez ShopiMarket, nous
            vous proposons des articles variés allant des dernières tendances en
            électronique, mode et accessoires, jusqu{"'"}à des solutions
            pratiques pour la maison, le bien-être et bien plus encore. Chaque
            produit est conçu pour offrir une expérience utilisateur optimale,
            alliant performance, fiabilité et prix compétitifs. Que vous soyez à
            la recherche de nouveautés, de produits phares ou d{"'"}offres
            exclusives, notre catalogue regroupe des articles sélectionnés pour
            vous garantir satisfaction et qualité.
          </p>
          <p>
            Nous mettons également un accent particulier sur la diversité et l
            {"'"}innovation, en vous permettant d{"'"}explorer des produits
            uniques qui simplifient et améliorent votre quotidien. Grâce à notre
            service client dédié et une livraison rapide, SnipersMarketest votre
            destination de choix pour faire vos achats en ligne en toute
            confiance.
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
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(index)}>
            {tab.title}
          </button>
        ))}
      </div>

      <div className="p-6 text-gray-700 tab-content">
        {tabs[activeTab].content}
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-2 sm:mt-8 product-images">
        <div className="relative min-w-[283px] min-h-[143px] max-w-[600px] max-h-[600px] overflow-hidden">
          <Image
            src={src}
            alt={alt}
            layout="responsive"
            width={381}
            height={450}
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>
        {/* 
        <div className="relative min-w-[283px] min-h-[143px] max-w-[600px] max-h-[600px]">
          <Image
            src={src}
            alt="Produit 2"
            layout="responsive"
            width={381}
            height={400}
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div> */}
      </div>
    </div>
  );
}
