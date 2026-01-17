/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { useCheckout } from "@/hooks/useCheckout";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiMinus, FiPlus, FiTruck } from "react-icons/fi";
import PaymentCheckout from "./PaymentCheckout";
import DeliveryForm, { DeliveryAddress } from "./DeliveryForm";
import { useState } from "react";
import { normalizeImagePath } from "@/utils/imageUtils";

const CheckoutContainer = () => {
  const {
    handleDelete,
    handleQuantityChange,
    calculateTotal,
    cart
  } = useCheckout();
  
  const [currentStep, setCurrentStep] = useState<"delivery" | "payment">("delivery");
  const [deliveryData, setDeliveryData] = useState<DeliveryAddress | null>(null);
  const [isSavingDelivery, setIsSavingDelivery] = useState(false);

  const handleDeliverySubmit = async (data: DeliveryAddress) => {
    setIsSavingDelivery(true);
    try {
      // Simuler une sauvegarde (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeliveryData(data);
      setCurrentStep("payment");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des coordonnées:", error);
    } finally {
      setIsSavingDelivery(false);
    }
  };
if (cart.length === 0) {
  return (
    <Container className="py-24">
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="flex justify-center items-center w-32 h-32 rounded-full bg-primary-50">
          🛒
        </div>

        <Typography variant="h3" className="font-bold">
          Votre panier est vide
        </Typography>

        <Typography variant="body" className="max-w-md text-gray-500">
          Parcourez notre catalogue et ajoutez des articles à votre panier pour
          commencer vos achats.
        </Typography>

        <Button className="px-8 py-3">Continuer mes achats</Button>
      </div>
    </Container>
  );
}

  return (
    <Container className="py-6 md:py-12">
      {/* Indicateur de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div
            className={`flex items-center gap-2 ${
              currentStep === "delivery" ? "text-primary" : "text-gray-400"
            }`}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === "delivery"
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 bg-white"
              }`}>
              {currentStep === "payment" ? "✓" : "1"}
            </div>
            <span className="hidden sm:inline font-medium">Livraison</span>
          </div>
          <div
            className={`w-8 md:w-16 h-0.5 ${
              currentStep === "payment" ? "bg-primary" : "bg-gray-300"
            }`}
          />
          <div
            className={`flex items-center gap-2 ${
              currentStep === "payment" ? "text-primary" : "text-gray-400"
            }`}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === "payment"
                  ? "bg-primary border-primary text-white"
                  : "border-gray-300 bg-white"
              }`}>
              2
            </div>
            <span className="hidden sm:inline font-medium">Paiement</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:gap-10 lg:grid-cols-3">
        {/* ================= CONTENU PRINCIPAL ================= */}
        <div className="space-y-6 lg:col-span-2">
          {currentStep === "delivery" ? (
            /* ================= FORMULAIRE DE LIVRAISON ================= */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-200">
                <Typography variant="h4" className="font-bold text-gray-900">
                  Coordonnées de livraison
                </Typography>
                <Typography variant="caption1" className="text-gray-600 mt-1">
                  Remplissez vos informations pour finaliser votre commande
                </Typography>
              </div>
              <div className="p-4 md:p-6">
                <DeliveryForm
                  onSubmit={handleDeliverySubmit}
                  defaultValues={deliveryData || undefined}
                  isLoading={isSavingDelivery}
                />
              </div>
            </div>
          ) : (
            /* ================= FORMULAIRE DE PAIEMENT ================= */
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography
                      variant="h4"
                      className="font-bold text-gray-900">
                      Informations de paiement
                    </Typography>
                    <Typography
                      variant="caption1"
                      className="text-gray-600 mt-1">
                      Paiement sécurisé par Stripe
                    </Typography>
                  </div>
                  <button
                    onClick={() => setCurrentStep("delivery")}
                    className="text-sm text-primary hover:text-primary-600 font-medium">
                    Modifier
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <PaymentCheckout embedded={true} />
              </div>
            </div>
          )}

          {/* ================= PANIER ================= */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-6">
            <Typography variant="h4" className="mb-4 font-bold text-gray-900">
              Votre panier
            </Typography>

            <div className="space-y-3 md:space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-100 transition hover:border-gray-200">
                  {/* Image */}
                  <div className="overflow-hidden relative w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-lg flex-shrink-0">
                    <Image
                      src={normalizeImagePath(item.src)}
                      alt={item.alt}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Infos */}
                  <div className="flex flex-col flex-1 justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Typography
                          variant="body"
                          className="font-semibold text-gray-900 truncate">
                          {item.alt}
                        </Typography>
                        <Typography
                          variant="caption1"
                          className="mt-1 text-gray-500">
                          {item.selectedSize && `Taille : ${item.selectedSize}`}
                          {item.selectedSize && item.selectedColor && " · "}
                          {item.selectedColor &&
                            `Couleur : ${item.selectedColor}`}
                        </Typography>
                      </div>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-gray-400 transition hover:text-red-500 flex-shrink-0"
                        aria-label="Supprimer l'article">
                        <RiDeleteBinLine size={18} />
                      </button>
                    </div>

                    {/* Prix + Quantité */}
                    <div className="flex justify-between items-center mt-3">
                      <Typography className="text-base md:text-lg font-bold text-primary">
                        € {item.prix.toFixed(2)}
                      </Typography>
                      <div className="flex overflow-hidden items-center rounded-lg border border-gray-200">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              Number(item.quantity) - 1
                            )
                          }
                          disabled={Number(item.quantity) <= 1}
                          className="px-2 md:px-3 py-1 hover:bg-gray-100 disabled:opacity-40 transition">
                          <FiMinus size={14} />
                        </button>
                        <span className="px-2 md:px-4 font-medium text-sm md:text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              Number(item.quantity) + 1
                            )
                          }
                          className="px-2 md:px-3 py-1 hover:bg-gray-100 transition">
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RÉCAP / PAIEMENT ================= */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="p-4 md:p-6 space-y-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Typography variant="h4" className="mb-4 font-bold text-gray-900">
              Récapitulatif
            </Typography>

            <div className="space-y-3">
              <div className="flex justify-between text-sm md:text-base text-gray-700">
                <span className="font-medium">Sous-total</span>
                <span className="font-semibold">
                  € {calculateTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm md:text-base text-gray-700">
                <span className="font-medium">Livraison</span>
                <span className="font-semibold text-green-600">Gratuite</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between pt-2 text-base md:text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-lg md:text-xl text-primary">
                  € {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Info de sécurité */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2 items-center text-xs md:text-sm text-gray-600">
                <svg
                  className="w-4 h-4 md:w-5 md:h-5 text-green-600"
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
                <span>Paiement sécurisé par Stripe</span>
              </div>
            </div>
          </div>

          {/* Affichage des coordonnées de livraison si renseignées */}
          {deliveryData && currentStep === "payment" && (
            <div className="p-4 md:p-6 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiTruck className="text-primary" size={18} />
                  <Typography
                    variant="h5"
                    className="font-semibold text-gray-900">
                    Adresse de livraison
                  </Typography>
                </div>
                <button
                  onClick={() => setCurrentStep("delivery")}
                  className="text-sm text-primary hover:text-primary-600 font-medium">
                  Modifier
                </button>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-medium">
                  {deliveryData.firstName} {deliveryData.lastName}
                </p>
                {deliveryData.deliveryType === "home" &&
                  deliveryData.address && (
                    <>
                      <p>{deliveryData.address}</p>
                      {deliveryData.address2 && <p>{deliveryData.address2}</p>}
                      <p>
                        {deliveryData.postalCode} {deliveryData.city}
                      </p>
                      <p>{deliveryData.country}</p>
                    </>
                  )}
                {deliveryData.deliveryType === "pickup" && (
                  <p className="text-gray-600">Retrait en point relais</p>
                )}
                <p className="mt-2 text-gray-600">{deliveryData.email}</p>
                <p className="text-gray-600">{deliveryData.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default CheckoutContainer;
