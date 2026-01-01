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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de sécurité */}
      <div className="flex gap-2 items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
        <FiLock className="text-blue-600" size={18} />
        <Typography variant="caption4" className="text-blue-700">
          Paiement sécurisé et crypté via Stripe
        </Typography>
      </div>

      {/* Élément de paiement Stripe */}
      <div className="p-4 bg-white rounded-lg border border-gray-300">
        <PaymentElement
          options={{
            layout: "tabs"
          }}
        />
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="flex gap-2 items-center p-3 bg-red-50 rounded-lg border border-red-200">
          <FiAlertCircle className="text-red-500" size={18} />
          <Typography variant="body" className="text-red-700">
            {error}
          </Typography>
        </div>
      )}

      {/* Bouton de paiement */}
      <Button
        type="submit"
        isLoading={isLoading || !stripe || !elements}
        disabled={isLoading || !stripe || !elements || paymentStatus === "processing"}
        fullwidth
        className="py-3 w-full text-lg font-semibold text-white bg-primary hover:bg-primary-dark">
        {isLoading || paymentStatus === "processing"
          ? "Traitement du paiement..."
          : `Payer €${amount.toFixed(2)}`}
      </Button>

      {/* Informations supplémentaires */}
      <div className="text-center">
        <Typography variant="caption4" className="text-gray-500">
          Vos informations de paiement sont sécurisées et ne seront jamais stockées
        </Typography>
      </div>
    </form>
  );
}

