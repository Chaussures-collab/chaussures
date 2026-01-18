/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import Typography from "@/ui/designSystem/typography/typography";

interface TrackingStep {
  status: string;
  label: string;
  description: string;
  date: string;
  completed: boolean;
}

interface TrackingData {
  order: {
    id: string;
    trackingNumber: string;
    status: string;
    userEmail: string;
    totalAmount: number;
    currency: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    createdAt: string;
    shippedAt?: string;
    estimatedDeliveryDate?: string;
  };
  tracking: {
    status: string;
    currentLocation: string;
    estimatedDelivery: string;
    steps: TrackingStep[];
  };
}

export default function TrackingPage() {
  const router = useRouter();
  const { trackingNumber } = router.query;
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingNumber || typeof trackingNumber !== "string") return;

    const fetchTrackingData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/tracking/${trackingNumber}`);
        const data = await response.json();

        if (data.success) {
          setTrackingData(data);
        } else {
          setError(data.error || "Erreur lors du chargement du suivi");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackingData();
  }, [trackingNumber]);

  const getStatusIcon = (status: string, completed: boolean) => {
    if (completed) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      );
    }

    const iconClass = "w-10 h-10 rounded-full border-2 flex items-center justify-center";
    const borderColor = status === "confirmed" || status === "preparation" 
      ? "border-yellow-500 bg-yellow-50"
      : "border-gray-300 bg-gray-50";

    return (
      <div className={`${iconClass} ${borderColor}`}>
        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <Seo
          title="Suivi de colis - SnipersMarket"
          description="Suivez votre commande en temps réel"
        />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="mb-4 w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
          <Typography variant="body" className="text-gray-600">
            Chargement du suivi...
          </Typography>
        </div>
      </Layout>
    );
  }

  if (error || !trackingData) {
    return (
      <Layout>
        <Seo
          title="Suivi de colis - SnipersMarket"
          description="Suivez votre commande en temps réel"
        />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 text-6xl">📦</div>
            <Typography variant="h2" className="mb-4">
              Suivi introuvable
            </Typography>
            <Typography variant="body" className="text-gray-600 mb-6">
              {error || "Le numéro de suivi n'existe pas ou n'est plus valide."}
            </Typography>
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-3 font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
              Retour à la boutique
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const { order, tracking } = trackingData;

  return (
    <Layout>
      <Seo
        title={`Suivi #${tracking.trackingNumber || trackingNumber} - SnipersMarket`}
        description="Suivez votre commande en temps réel"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <Typography variant="h1" className="mb-2">
              📦 Suivi de votre colis
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Numéro de suivi :{" "}
              <span className="font-mono font-bold text-primary">
                {order.trackingNumber}
              </span>
            </Typography>
          </div>

          {/* Status Card */}
          <div className="p-6 mb-8 bg-white rounded-lg shadow-md border-l-4 border-primary">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Typography variant="h3" className="mb-1">
                  {tracking.currentLocation}
                </Typography>
                <Typography variant="body-sm" className="text-gray-600">
                  Statut : {tracking.status}
                </Typography>
              </div>
              <div className="text-right">
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Livraison estimée
                </Typography>
                <Typography variant="body" className="font-semibold text-primary">
                  {tracking.estimatedDelivery}
                </Typography>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
            <Typography variant="h3" className="mb-6">
              Historique de livraison
            </Typography>
            <div className="space-y-6">
              {tracking.steps.map((step, index) => (
                <div key={step.status} className="flex gap-4">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    {getStatusIcon(step.status, step.completed)}
                    {index < tracking.steps.length - 1 && (
                      <div
                        className={`w-0.5 h-full min-h-[60px] mt-2 ${
                          step.completed ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-6">
                    <div
                      className={`flex items-start justify-between mb-1 ${
                        step.completed ? "opacity-100" : "opacity-60"
                      }`}>
                      <Typography
                        variant="body"
                        className={`font-semibold ${
                          step.completed ? "text-gray-900" : "text-gray-600"
                        }`}>
                        {step.label}
                      </Typography>
                      <Typography variant="body-sm" className="text-gray-500">
                        {step.date}
                      </Typography>
                    </div>
                    <Typography
                      variant="body-sm"
                      className={`${
                        step.completed ? "text-gray-700" : "text-gray-500"
                      }`}>
                      {step.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <Typography variant="h3" className="mb-4">
              Détails de la commande
            </Typography>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Numéro de commande
                </Typography>
                <Typography variant="body" className="font-mono font-semibold">
                  #{order.id.substring(0, 8)}...
                </Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Montant total
                </Typography>
                <Typography variant="body" className="font-semibold text-primary">
                  {order.totalAmount.toFixed(2)} {order.currency.toUpperCase()}
                </Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Email
                </Typography>
                <Typography variant="body">{order.userEmail}</Typography>
              </div>
              <div>
                <Typography variant="body-sm" className="text-gray-500 mb-1">
                  Date de commande
                </Typography>
                <Typography variant="body">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Typography variant="body-sm" className="text-gray-500 mb-3">
                Articles ({order.items.length})
              </Typography>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Typography variant="body" className="font-medium">
                        {item.name}
                      </Typography>
                      <Typography variant="body-sm" className="text-gray-500">
                        Quantité : {item.quantity}
                      </Typography>
                    </div>
                    <Typography variant="body" className="font-semibold">
                      {(item.price * item.quantity).toFixed(2)}{" "}
                      {order.currency.toUpperCase()}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push("/shop")}
              className="px-6 py-3 mr-4 font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors">
              Retour à la boutique
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
              Actualiser le suivi
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

