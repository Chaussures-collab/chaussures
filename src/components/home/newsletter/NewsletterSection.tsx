/** @format */

import React, { useState } from "react";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { FiMail } from "react-icons/fi";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'inscription à la newsletter
    setIsSubscribed(true);
    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="relative bg-gradient-to-br from-primary via-primary-dark to-purple-600 py-20 overflow-hidden">
      {/* Effets de fond animés */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icône avec animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-ping"></div>
              <div className="relative p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <FiMail size={56} className="text-white" />
              </div>
            </div>
          </div>

          <Typography variant="h3" className="text-white font-bold mb-4 text-3xl md:text-4xl">
            Restez informé de nos offres
          </Typography>
          <Typography variant="body" className="text-white/90 mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter et recevez des offres exclusives,
            des nouveautés et des réductions spéciales directement dans votre
            boîte mail. Ne manquez aucune opportunité !
          </Typography>

          {isSubscribed ? (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 text-white border border-white/30 shadow-xl animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <Typography variant="body" className="font-semibold text-lg">
                  Merci pour votre inscription ! 🎉
                </Typography>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <div className="flex-1 relative group">
                <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={22} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  required
                  className="w-full pl-14 pr-6 py-5 rounded-xl border-0 focus:ring-4 focus:ring-white/30 outline-none text-gray-900 text-lg shadow-xl transition-all duration-300 hover:shadow-2xl"
                />
              </div>
              <Button
                type="submit"
                variant="accent"
                className="px-10 py-5 rounded-xl whitespace-nowrap text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                S&apos;abonner
              </Button>
            </form>
          )}

          <Typography variant="caption1" className="text-white/80 mt-6 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Nous respectons votre vie privée. Désabonnez-vous à tout moment.
          </Typography>
        </div>
      </Container>
    </div>
  );
}

