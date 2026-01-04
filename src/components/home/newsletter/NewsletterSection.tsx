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
    <div className="bg-gradient-to-r from-primary to-primary-dark py-16">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full">
              <FiMail size={48} className="text-white" />
            </div>
          </div>

          <Typography variant="h4" className="text-white font-bold mb-4">
            Restez informé de nos offres
          </Typography>
          <Typography variant="body" className="text-white/90 mb-8">
            Inscrivez-vous à notre newsletter et recevez des offres exclusives,
            des nouveautés et des réductions spéciales directement dans votre
            boîte mail.
          </Typography>

          {isSubscribed ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
              <Typography variant="body" className="font-semibold">
                Merci pour votre inscription ! 🎉
              </Typography>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 px-6 py-4 rounded-lg border-0 focus:ring-2 focus:ring-white/50 outline-none text-gray-900"
              />
              <Button
                type="submit"
                variant="accent"
                className="px-8 py-4 rounded-lg whitespace-nowrap">
                S&apos;abonner
              </Button>
            </form>
          )}

          <Typography variant="caption1" className="text-white/70 mt-4">
            Nous respectons votre vie privée. Désabonnez-vous à tout moment.
          </Typography>
        </div>
      </Container>
    </div>
  );
}

