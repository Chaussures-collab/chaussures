/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

import { useState } from "react";
import { toast } from "react-toastify";
import { useCart } from "@/context/cartContext";
import { useAuth } from "@/context/AuthUserContext";
import { generateOrderNumber, sendEmail } from "@/services/checkout";

export const useCheckout = () => {
  const { authUser } = useAuth();
  const { cart, updateCartItem, removeCartItem, calculateTotalPromoPrice } =
    useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    cardNum: "",
    expDate: "",
    cvvNumber: "",
    cardHolder: ""
  });

  const orderNumber = generateOrderNumber();
  const orderDate = new Date().toLocaleDateString();

  const handlePaymentNotification = async (
    templateParams: any,
    serviceId: string,
    templateId: string,
    isToSupplier = false
  ) => {
    if (!authUser) {
      toast.error("Veuillez vous connecter avant de passer la commande.");
      return;
    }

    try {
      setIsLoading(true);
      await sendEmail(templateParams, serviceId, templateId);

      if (isToSupplier) {
        await sendToSupplier(orderNumber, orderDate);
      }

      toast.success(
        "Veuillez consulter votre e-mail pour finaliser votre commande."
      );
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi du message.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendToSupplier = async (orderNumber: string, orderDate: string) => {
    const templateParams = {
      from_name: authUser?.nom ?? "Client",
      email: authUser?.email ?? "email_inconnu",
      order_number: orderNumber,
      order_date: orderDate,
      order_total: calculateTotalPromoPrice(),
      payment_method: "Carte bancaire"
    };

    await sendEmail(templateParams, "service_onvs4ax", "template_t5ylmkn");
  };

  const sendToClient = (orderNumber: string, orderDate: string) => {
    const templateParams = {
      from_name: authUser?.nom ?? "Client",
      email: authUser?.email ?? "email_inconnu",
      user_name: bankDetails.cardHolder,
      order_number: orderNumber,
      order_date: orderDate,
      order_total: calculateTotalPromoPrice(),
      payment_method: "Carte bancaire"
    };

    return handlePaymentNotification(
      templateParams,
      "service_v9jsj28",
      "template_ki3s83p"
    );
  };

  const handleBankPayment = () => {
    if (!authUser) {
      toast.error("Veuillez vous connecter avant de passer la commande.");
      return;
    }

    if (!Object.values(bankDetails).every(Boolean)) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    const templateParams = {
      from_name: authUser.nom,
      reply_to: authUser.email,
      prixTotal: calculateTotalPromoPrice(),
      bank_name: bankDetails.cardHolder,
      cardNum: bankDetails.cardNum,
      expDate: bankDetails.expDate,
      cvvNumber: bankDetails.cvvNumber
    };

    handlePaymentNotification(
      templateParams,
      "service_v9jsj28",
      "template_qrinzfc"
    );

    sendToClient(orderNumber, orderDate);
  };

  const handlePaiement2 = () => {
    if (!authUser) {
      toast.error("Veuillez vous connecter avant de passer la commande.");
      return;
    }

    const templateParams = {
      prixTotal: calculateTotalPromoPrice(),
      to_email: authUser.email
    };

    handlePaymentNotification(
      templateParams,
      "service_onvs4ax",
      "template_pjzftap"
    );
  };

  const calculateTotal = () =>
    cart.reduce(
      (acc, item) =>
        acc + (Number(item.prix) || 0) * (Number(item.quantity) || 0),
      0
    );

  const handleQuantityChange = (id: any, value: any) => {
    if (value > 0) updateCartItem(String(id), value);
  };

  const handleDelete = (id: any) => {
    removeCartItem(String(id));
  };

  return {
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
  };
};
