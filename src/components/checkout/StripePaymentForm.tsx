/** @format */

import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import Button from "@/ui/designSystem/button/button";
import Typography from "@/ui/designSystem/typography/typography";
import { FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useRouter } from "next/router";

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
}

export default function StripePaymentForm({
  clientSecret,
  amount
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "succeeded" | "failed"
  >("idle");

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    // Vérifier le statut du Payment Intent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent) {
        switch (paymentIntent.status) {
          case "succeeded":
            setPaymentStatus("succeeded");
            break;
          case "processing":
            setPaymentStatus("processing");
            break;
          case "requires_payment_method":
            setPaymentStatus("idle");
            break;
          default:
            setPaymentStatus("idle");
        }
      }
    });
  }, [stripe, clientSecret]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Confirmer le paiement
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Erreur lors de la soumission du formulaire");
        setIsLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`
        },
        redirect: "if_required"
      });

      if (confirmError) {
        setError(confirmError.message || "Erreur lors du paiement");
        setPaymentStatus("failed");
      } else if (paymentIntent) {
        if (paymentIntent.status === "succeeded") {
          setPaymentStatus("succeeded");
          // Rediriger vers la page de succès
          router.push("/checkout/success");
        } else if (paymentIntent.status === "requires_action") {
          // Le paiement nécessite une action supplémentaire (3D Secure)
          // Stripe gère automatiquement la redirection
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inattendue s'est produite"
      );
      setPaymentStatus("failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (paymentStatus === "succeeded") {
    return (
      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="flex gap-3 items-center">
          <FiCheckCircle className="text-green-500" size={24} />
          <div>
            <Typography variant="h4" className="text-green-800">
              Paiement réussi !
            </Typography>
            <Typography variant="body" className="text-green-600">
              Redirection en cours...
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Élément de paiement Stripe avec design amélioré */}
      <div className="relative">
        <div className="p-5 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-primary transition-colors">
          <PaymentElement
            options={{
              layout: "tabs",
              business: {
                name: "ShopiMarket"
              }
            }}
          />
        </div>
      </div>

      {/* Affichage des erreurs avec design amélioré */}
      {error && (
        <div className="flex gap-3 items-start p-4 bg-red-50 rounded-xl border border-red-200 animate-fadeIn">
          <div className="flex-shrink-0 mt-0.5">
            <FiAlertCircle className="text-red-500" size={20} />
          </div>
          <div className="flex-1">
            <Typography variant="body-sm" className="font-medium text-red-800 mb-1">
              Erreur de paiement
            </Typography>
            <Typography variant="caption1" className="text-red-700">
              {error}
            </Typography>
          </div>
        </div>
      )}

      {/* Bouton de paiement avec design amélioré */}
      <div className="pt-2">
        <Button
          type="submit"
          isLoading={isLoading || !stripe || !elements}
          disabled={isLoading || !stripe || !elements || paymentStatus === "processing"}
          fullwidth
          className="py-4 w-full text-base font-semibold text-white bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl">
          {isLoading || paymentStatus === "processing" ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement du paiement...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <FiLock size={18} />
              Payer €{amount.toFixed(2)}
            </span>
          )}
        </Button>
      </div>

      {/* Informations supplémentaires avec design amélioré */}
      <div className="pt-2 text-center">
        <Typography variant="caption1" className="text-gray-500 flex items-center justify-center gap-1.5">
          <FiLock size={12} className="text-gray-400" />
          Vos informations de paiement sont sécurisées et ne seront jamais stockées
        </Typography>
      </div>
    </form>
  );
}

