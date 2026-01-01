/** @format */

import React from "react";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import {
  FiTruck,
  FiShield,
  FiHeadphones,
  FiRefreshCw,
  FiCreditCard,
  FiPackage
} from "react-icons/fi";

const features = [
  {
    icon: <FiTruck size={32} />,
    title: "Livraison rapide",
    description: "Expédition sous 24-48h"
  },
  {
    icon: <FiShield size={32} />,
    title: "Paiement sécurisé",
    description: "Transactions 100% sécurisées"
  },
  {
    icon: <FiHeadphones size={32} />,
    title: "Support client",
    description: "Assistance 7j/7"
  },
  {
    icon: <FiRefreshCw size={32} />,
    title: "Retours faciles",
    description: "30 jours pour changer d'avis"
  },
  {
    icon: <FiCreditCard size={32} />,
    title: "Paiement flexible",
    description: "Plusieurs moyens de paiement"
  },
  {
    icon: <FiPackage size={32} />,
    title: "Qualité garantie",
    description: "Produits certifiés"
  }
];

export default function FeaturesSection() {
  return (
    <div className="bg-gray-50 py-16">
      <Container>
        <div className="text-center mb-12">
          <Typography variant="h2" className="font-bold text-gray-900 mb-4">
            Pourquoi nous choisir ?
          </Typography>
          <Typography variant="body" className="text-gray-600 max-w-2xl mx-auto">
            Nous nous engageons à vous offrir la meilleure expérience d{"'"}achat
            en ligne avec des services de qualité supérieure
          </Typography>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
              </div>
              <Typography
                variant="body"
                className="font-semibold text-gray-900 mb-2">
                {feature.title}
              </Typography>
              <Typography variant="caption1" className="text-gray-600">
                {feature.description}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

