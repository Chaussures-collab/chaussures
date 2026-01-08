/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Typography from "@/ui/designSystem/typography/typography";
import { Input } from "@/ui/designSystem/forms/input";
import Button from "@/ui/designSystem/button/button";
import { FiBell, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

interface StockNotificationProps {
  productId: string | number;
  productName: string;
  currentStock: number;
  className?: string;
}

interface NotificationFormData {
  email: string;
}

export default function StockNotification({
  productId,
  productName,
  currentStock,
  className = ""
}: StockNotificationProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<NotificationFormData>();

  const onSubmit = async (data: NotificationFormData) => {
    setIsLoading(true);
    try {
      // Sauvegarder la notification dans Firestore
      const response = await fetch("/api/stock-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: String(productId),
          productName,
          email: data.email
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'enregistrement de la notification");
      }

      setIsSubscribed(true);
      reset();
      toast.success("Vous serez notifié lorsque le produit sera de nouveau en stock !");
    } catch (error) {
      console.error("Erreur lors de l'abonnement aux notifications:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStock > 0) {
    return null; // Ne pas afficher si le produit est en stock
  }

  if (isSubscribed) {
    return (
      <div className={`p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-2">
          <FiCheck className="w-5 h-5 text-green-600" />
          <Typography variant="body" className="text-green-800 font-medium">
            Vous serez notifié par email lorsque ce produit sera de nouveau en stock.
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <FiBell className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="flex-1">
          <Typography variant="h5" className="mb-2 font-semibold text-gray-900">
            Produit en rupture de stock
          </Typography>
          <Typography variant="body-sm" className="mb-4 text-gray-600">
            Soyez le premier informé lorsque <strong>{productName}</strong> sera
            de nouveau disponible !
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input<NotificationFormData>
              id="email"
              label="Votre email"
              type="email"
              placeholder="votre@email.com"
              register={register}
              errors={errors}
              watch={watch}
              required
              errorMsg="L'email est requis"
              validationRules={{
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email invalide"
                }
              }}
            />{/* 

            <Button
              type="submit"
              variant="accent"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full">
              <FiBell className="mr-2" size={16} />
              M&apos;informer quand disponible
            </Button> */}
            <Button
              type="submit"
              variant="accent"
              isLoading={isLoading}
              disabled={isLoading}
              size="medium"
              icon={{ icon: FiBell }}
              iconPosition="left"
              className="w-full"
              /* action={() => console.log("Ajout au panier")} */
            >
              M&apos;informer quand disponible{" "}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

