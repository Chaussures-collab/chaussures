/** @format */

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "./StripePaymentForm";
import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import { useAuth } from "@/context/AuthUserContext";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";

// Initialiser Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface PaymentCheckoutProps {
  onPaymentSuccess?: () => void;
  embedded?: boolean; // Mode intégré sans Container
}

export default function PaymentCheckout({
  // onPaymentSuccess,
  embedded = false
}: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempOrderId, setTempOrderId] = useState<string | null>(null);
  const { authUser } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  // Calculer le montant total
  const totalAmount = cart.reduce(
    (sum, item) =>
      sum +
      (item.promotion ? Number(item.promotion) : Number(item.prix) || 0) *
        Number(item.quantity || 1),
    0
  );

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    if (!authUser) {
      router.push("/connexion");
      return;
    }

    // Vérifier que le panier n'est pas vide
    if (cart.length === 0) {
      router.push("/cart");
      return;
    }

    // Créer le Payment Intent
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Générer un orderId temporaire unique pour cette session de paiement
        const orderId = uuidv4();
        setTempOrderId(orderId);

        // Sauvegarder en localStorage aussi (au cas où sessionStorage ne serait pas disponible)
        if (typeof window !== "undefined") {
          localStorage.setItem("tempOrderId", orderId);
          sessionStorage.setItem("tempOrderId", orderId);
        }

        // Transformer les items du panier
        const items = cart.map((item) => ({
          id: String(item.id),
          name: item.alt || item.nom || "Produit",
          price: item.promotion
            ? Number(item.promotion)
            : Number(item.prix) || 0,
          quantity: Number(item.quantity) || 1,
          description: item.description,
          imageUrl: item.src
        }));

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            items,
            userId: authUser.uid,
            userEmail: authUser.email,
            orderId // Passer l'orderId au backend
          })
        });

        const data = await response.json();

        if (!response.ok) {
          // Gestion spéciale pour l'erreur d'onboarding Stripe
          if (data.code === "account_not_activated") {
            throw new Error(
              `Votre compte Stripe n'est pas encore complètement activé pour les transactions. ` +
                `Veuillez compléter l'onboarding sur https://dashboard.stripe.com/account/onboarding ` +
                `pour lever cette restriction. Si vous êtes un client et que vous souhaitez effectuer un achat, ` +
                `veuillez contacter le propriétaire du site.`
            );
          }
          throw new Error(
            data.error || "Erreur lors de la création du paiement"
          );
        }

        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("Client secret non reçu");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Une erreur s'est produite lors de la création du paiement"
        );
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [authUser, cart, router]);

  if (isLoading) {
    const LoadingContent = (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
        <Typography variant="body-sm" className="text-gray-600">
          Préparation du paiement...
        </Typography>
      </div>
    );

    if (embedded) {
      return LoadingContent;
    }

    return <Container className="py-12">{LoadingContent}</Container>;
  }

  if (error) {
    const isStripeAccountError =
      error.includes("onboarding") || error.includes("activé");

    const ErrorContent = (
      <div
        className={`p-4 rounded-lg border ${
          isStripeAccountError
            ? "bg-yellow-50 border-yellow-200"
            : "bg-red-50 border-red-200"
        }`}>
        <Typography
          variant="h5"
          className={`mb-2 ${
            isStripeAccountError ? "text-yellow-800" : "text-red-800"
          }`}>
          {isStripeAccountError ? "Compte non activé" : "Erreur"}
        </Typography>
        <Typography
          variant="body-sm"
          className={isStripeAccountError ? "text-yellow-700" : "text-red-600"}>
          {error}
        </Typography>
        {isStripeAccountError && (
          <div className="mt-3">
            <a
              href="https://dashboard.stripe.com/account/onboarding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
              Compléter l{"'"}onboarding Stripe
            </a>
          </div>
        )}
      </div>
    );

    if (embedded) {
      return ErrorContent;
    }

    return <Container className="py-12">{ErrorContent}</Container>;
  }

  if (!clientSecret) {
    const NoSecretContent = (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <Typography variant="body-sm" className="text-yellow-800">
          Impossible de créer la session de paiement. Veuillez réessayer.
        </Typography>
      </div>
    );

    if (embedded) {
      return NoSecretContent;
    }

    return <Container className="py-12">{NoSecretContent}</Container>;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#6366f1", // Couleur primaire de votre thème
        colorBackground: "#ffffff",
        colorText: "#1f2937",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px"
      }
    }
  };

  const PaymentContent = (
    <div className="space-y-4">
      <Elements stripe={stripePromise} options={options}>
        <StripePaymentForm clientSecret={clientSecret} amount={totalAmount} />
      </Elements>
    </div>
  );

  if (embedded) {
    return PaymentContent;
  }

  return (
    <Container className="py-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête avec récapitulatif */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h3" className="font-bold text-gray-900">
              Paiement sécurisé
            </Typography>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>Paiement sécurisé</span>
            </div>
          </div>

          {/* Récapitulatif du montant */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <Typography variant="body" className="text-gray-600">
              Montant total
            </Typography>
            <Typography variant="h4" className="font-bold text-primary">
              €{totalAmount.toFixed(2)}
            </Typography>
          </div>
        </div>

        {/* Formulaire de paiement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {PaymentContent}
        </div>

        {/* Informations de sécurité */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Paiement 100% sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>Données cryptées</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span>Powered by Stripe</span>
          </div>
        </div>
      </div>
    </Container>
  );
}

