/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

/** @format */

import { useState } from "react";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";

import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/AuthUserContext";
import { IoClose } from "react-icons/io5";
import { useCheckout } from "@/hooks/useCheckout";

const CheckoutContainer = () => {
  const {
    cart,
    isLoading,
    showBankForm,
    bankDetails,
    setBankDetails,
    setShowBankForm,
    calculateTotal,
    handleDelete,
    handleQuantityChange,
    handleBankPayment,
    handlePaiement2
  } = useCheckout();

  return (
    <Container className="py-12">
      <div className="space-y-6">
        {/* Section Panier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Typography
              variant="h4"
              className="bg-primary text-white text-fold shadow w-full p-3 rounded-lg">
              1. Contenu de votre panier
            </Typography>

            <div className="bg-primary-50 space-y-4 shadow w-full p-6 rounded-lg mt-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-primary pb-4 last:border-none">
                  {/* Image du produit */}
                  <div className="relative h-16 w-16 md:h-24 md:w-24 overflow-hidden rounded-lg">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>

                  {/* Informations du produit */}
                  <div className="flex-1 ml-4">
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="h4"
                        className="truncate text-primary">
                        {item.alt}
                      </Typography>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition duration-200"
                        aria-label="Supprimer l'article">
                        <RiDeleteBinLine size={24} className="text-primary" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <Typography variant="body">
                        Taille :{" "}
                        <span className="text-gray-400">
                          {item.selectedSize}
                        </span>
                      </Typography>
                      <Typography variant="body">
                        Couleur :{" "}
                        <span className="text-gray-400">
                          {item.selectedColor}
                        </span>
                      </Typography>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Typography className="text-lg font-semibold text-gray-800">
                        € {item.prix.toFixed(2)}
                      </Typography>
                      <input
                        type="number"
                        min="1"
                        className="w-16 text-center border border-gray-300 rounded"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total du panier */}
            <div className="flex justify-between mt-4">
              <Typography variant="h4">Total</Typography>
              <Typography variant="h4" theme="primary">
                € {calculateTotal().toFixed(2)}
              </Typography>
            </div>
          </div>

          {/* Section Paiement */}
          <div className="space-y-6">
            <Typography
              variant="h4"
              className="bg-primary text-white text-fold shadow w-full p-3 rounded-lg">
              2. Mode de paiement
            </Typography>

            <div className="flex justify-between">
              <Typography variant="h4">Produits</Typography>
              <Typography variant="h4">Totaux</Typography>
            </div>

            <div className="flex justify-between mt-2">
              <Typography variant="body">Total</Typography>
              <Typography variant="body" theme="primary">
                € {calculateTotal().toFixed(2)}
              </Typography>
            </div>

            <hr className="border-gray-3" />

            {/* Instructions de paiement */}
            <Typography
              variant="body-base"
              component="p"
              className="text-justify text-gray-3">
              Effectuez votre paiement directement sur notre compte bancaire.
              Veuillez utiliser votre identifiant de commande comme référence de
              paiement. Votre commande ne sera expédiée qu{"'"}une fois les
              fonds crédités sur notre compte.
            </Typography>

            <Typography
              variant="body-base"
              component="p"
              className="text-justify text-gray-3">
              Vos données personnelles seront utilisées pour gérer votre
              expérience sur ce site, gérer l{"'"}accès à votre compte et pour d
              {"'"}autres fins décrites dans notre
              <span className="font-weight-bold">
                {" "}
                politique de confidentialité
              </span>
              .
            </Typography>

            {/* Bouton de paiement par compte bancaire */}
            {!showBankForm && (
              <Button
                action={() => setShowBankForm(true)}
                className="w-full px-4 py-2 text-white bg-secondary rounded hover:bg-secondary-dark">
                COMPTE BANCAIRE
              </Button>
            )}

            {showBankForm && (
              <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <Typography variant="h4" className="mb-2">
                    Informations Bancaires
                  </Typography>
                  <IoClose
                    className="text-2xl text-gray-400 cursor-pointer"
                    onClick={() => setShowBankForm(false)}
                  />
                </div>

                {/* Numéro de carte */}
                <div className="space-y-2">
                  <label htmlFor="cardNum">Numéro de la carte</label>
                  <input
                    type="text"
                    id="cardNum"
                    name="cardNum"
                    placeholder="1234 5678 9012 3456"
                    value={bankDetails.cardNum}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, ""); // Supprime tout sauf les chiffres
                      value = value.replace(/(.{4})/g, "$1 ").trim(); // Ajoute un espace tous les 4 chiffres
                      if (value.length > 19) return;
                      setBankDetails((prev) => ({ ...prev, cardNum: value }));
                    }}
                    className="p-2 w-full border border-gray-300 rounded"
                    maxLength={19}
                    autoComplete="off"
                  />
                </div>

                {/* Date d'expiration et cvvNumber */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expDate">Date d{"'"}expiration</label>
                    <input
                      type="text"
                      id="expDate"
                      name="expDate"
                      placeholder="MM/YY"
                      value={bankDetails.expDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Supprime tout sauf les chiffres
                        if (value.length > 4) return;
                        if (value.length >= 2)
                          value = value.replace(/^(\d{2})/, "$1/"); // Ajoute le "/"
                        setBankDetails((prev) => ({ ...prev, expDate: value }));
                      }}
                      className="p-2 w-full border border-gray-300 rounded"
                      maxLength={5}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="cvvNumber">CVV</label>
                    <input
                      type="text"
                      id="cvvNumber"
                      name="cvvNumber"
                      placeholder="***"
                      value={bankDetails.cvvNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // Supprime tout sauf les chiffres
                        if (value.length > 3) return;
                        setBankDetails((prev) => ({
                          ...prev,
                          cvvNumber: value
                        }));
                      }}
                      className="p-2 w-full border border-gray-300 rounded"
                      maxLength={3}
                      autoComplete="off"
                    />
                  </div>
                </div>

                {/* Nom du titulaire */}
                <div className="space-y-2">
                  <label htmlFor="cardHolder">Nom du titulaire</label>
                  <input
                    type="text"
                    id="cardHolder"
                    name="cardHolder"
                    placeholder="Nom complet"
                    value={bankDetails.cardHolder}
                    onChange={(e) =>
                      setBankDetails((prev) => ({
                        ...prev,
                        cardHolder: e.target.value
                      }))
                    }
                    className="p-2 w-full border border-gray-300 rounded"
                    autoComplete="off"
                  />
                </div>

                {/* Bouton de validation */}
                <Button
                  action={handleBankPayment}
                  isLoading={isLoading}
                  className="w-full px-4 py-2 text-white bg-secondary rounded hover:bg-secondary-600">
                  Valider le paiement
                </Button>
              </div>
            )}

            <Button
              action={handlePaiement2}
              isLoading={isLoading}
              className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark">
              PAYPAL
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutContainer;
