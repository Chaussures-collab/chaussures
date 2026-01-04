/** @format */

import React from "react";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import { RiStarFill } from "react-icons/ri";

const testimonials = [
  {
    name: "Sophie Martin",
    role: "Cliente satisfaite",
    rating: 5,
    comment:
      "Excellente expérience d'achat ! Les produits sont de qualité et la livraison était rapide. Je recommande vivement."
  },
  {
    name: "Thomas Dubois",
    role: "Acheteur régulier",
    rating: 5,
    comment:
      "Service client au top et produits conformes aux descriptions. Une plateforme fiable pour mes achats en ligne."
  },
  {
    name: "Marie Leroy",
    role: "Nouvelle cliente",
    rating: 5,
    comment:
      "Premier achat et je suis déjà conquise ! Interface intuitive, paiement sécurisé et produits de qualité."
  }
];

export default function TestimonialsSection() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      <Container>
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Typography variant="caption1" className="text-primary font-semibold">
              Témoignages clients
            </Typography>
          </div>
          <Typography variant="h4" className="font-bold text-gray-900 mb-4">
            Ce que disent nos clients
          </Typography>
          <Typography variant="body-lg" className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les témoignages authentiques de nos clients satisfaits qui font
            confiance à notre plateforme pour leurs achats en ligne
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 group">
              {/* Note */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <RiStarFill key={i} className="text-yellow-400" size={24} />
                ))}
              </div>

              {/* Commentaire */}
              <Typography variant="body-lg" className="text-gray-700 mb-8 italic leading-relaxed">
                &quot;{testimonial.comment}&quot;
              </Typography>

              {/* Auteur */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <Typography variant="body" className="font-bold text-gray-900">
                    {testimonial.name}
                  </Typography>
                  <Typography variant="caption1" className="text-gray-500">
                    {testimonial.role}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

