/** @format */

import Image from "next/image";
import React, { useState, useMemo } from "react";
import { normalizeImagePath } from "@/utils/imageUtils";
import { generateReviewsForProduct, calculateAverageRating, getTotalReviewsCount, Review } from "@/utils/reviewUtils";
import { RiStarFill, RiStarHalfFill, RiVerifiedBadgeFill } from "react-icons/ri";
import Typography from "@/ui/designSystem/typography/typography";

interface TabContent {
  title: string;
  content: React.ReactNode;
}
interface Props{
  src: string;
  alt: string;
  productId?: string;
}

export default function ProduitComment({src, alt, productId = "default"}:Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Générer les avis pour ce produit (augmenté à 12 pour plus de variété)
  const reviews = useMemo(() => generateReviewsForProduct(productId, 12), [productId]);
  const averageRating = useMemo(() => calculateAverageRating(productId), [productId]);
  const totalReviews = useMemo(() => getTotalReviewsCount(productId), [productId]);
  
  // Afficher 6 avis initialement, puis tous si "Voir plus" est cliqué
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);

  // Fonction pour afficher les étoiles
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<RiStarFill key={i} className="text-yellow-400" size={18} />);
    }
    
    if (hasHalfStar) {
      stars.push(<RiStarHalfFill key="half" className="text-yellow-400" size={18} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<RiStarFill key={`empty-${i}`} className="text-gray-300" size={18} />);
    }
    
    return stars;
  };

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
      title: `Avis [${totalReviews}]`,
      content: (
        <div className="space-y-6">
          {/* Résumé des avis */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="text-center md:text-left">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                  {renderStars(averageRating)}
                </div>
                <Typography variant="body" className="text-gray-600">
                  Basé sur {totalReviews} avis
                </Typography>
              </div>
              <div className="flex-1">
                {/* Distribution des notes */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].reverse().map((star) => {
                    const count = reviews.filter(r => Math.floor(r.rating) === star).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-8">{star}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Liste des avis */}
          <div className="space-y-4">
            <Typography variant="h5" className="text-gray-900 font-semibold">
              Avis clients ({reviews.length})
            </Typography>
            {displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Typography variant="body" className="font-semibold text-gray-900">
                          {review.author}
                        </Typography>
                        {review.verified && (
                          <RiVerifiedBadgeFill className="text-blue-500" size={18} title="Achat vérifié" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          {renderStars(review.rating)}
                        </div>
                        <Typography variant="caption1" className="text-gray-500">
                          {review.date}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
                <Typography variant="body" className="text-gray-700 leading-relaxed">
                  {review.comment}
                </Typography>
              </div>
            ))}
            {reviews.length > 6 && !showAllReviews && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="w-full py-3 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
                Voir tous les avis ({reviews.length})
              </button>
            )}
            {showAllReviews && reviews.length > 6 && (
              <button
                onClick={() => setShowAllReviews(false)}
                className="w-full py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Voir moins
              </button>
            )}
          </div>
        </div>
      )
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
            src={normalizeImagePath(src)}
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
