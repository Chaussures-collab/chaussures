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

const CheckoutContainer = () => {
  const { authUser } = useAuth();
  const { cart, updateCartItem, removeCartItem, calculateTotalPromoPrice } =
    useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    name: "",
    iban: "",
    bic: "",
  });
  // Envoi de l'e-mail
  const handleMessageMail = async () => {
    if (!authUser) {
      toast.error("Veuillez vous connecter avant de passer la commande.");
      return;
    }

    console.log("Envoi du mail...");

    setIsLoading(true);

    const templateParams = {
      from_name: authUser.nom ?? "Client",
      reply_to: authUser.email ?? "email_inconnu",
      prixTotal: calculateTotalPromoPrice(),
      to_email: "enlignechaussures@gmail.com",
    };

    try {
      const response = await emailjs.send(
        "service_onvs4ax",
        "template_pjzftap",
        templateParams,
        "PVVkJyq_LdxNGmNBV"
      );
      console.log("E-mail envoyé avec succès", response.status, response.text);
      alert("Veuillez consulter votre e-mail pour finaliser votre commande.");
      cart.forEach((item) => removeCartItem(item.id.toString()));
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail", error);
      toast.error("Une erreur est survenue lors de l'envoi du message.");
    } finally {
      setIsLoading(false);
      setShowBankForm(false);
    }
  };
  const handleBankPayment = async () => {
    if (!authUser) {
      toast.error("Veuillez vous connecter avant de passer la commande.");
      return;
    }

    if (!bankDetails.name || !bankDetails.iban || !bankDetails.bic) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }

    setIsLoading(true);

    const templateParams = {
      from_name: authUser.nom ?? "Client",
      reply_to: authUser.email ?? "email_inconnu",
      prixTotal: calculateTotalPromoPrice(),
      to_email: "enlignechaussures@gmail.com",
      bank_name: bankDetails.name,
      iban: bankDetails.iban,
      bic: bankDetails.bic,
    };

    try {
      await emailjs.send(
        "service_onvs4ax",
        "template_pjzftap",
        templateParams,
        "PVVkJyq_LdxNGmNBV"
      );
      toast.success("Commande enregistrée. Vérifiez votre email.");
      cart.forEach((item) => removeCartItem(item.id.toString()));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Erreur lors du paiement.");
    } finally {
      setIsLoading(false);
      setShowBankForm(false);
    }
  };
    const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const onSubmit = () => {
    console.log("Données soumises");
    handleMessageMail();
  };

  // Calcul du total du panier
  const calculateTotal = () =>
    cart.reduce(
      (acc, item) => acc + (Number(item.prix) || 0) * (Number(item.quantity) || 0),
      0
    );

  // Mise à jour de la quantité d'un article
  const handleQuantityChange = (id: string | number, value: number) => {
    if (value > 0) {
      updateCartItem(String(id), value);
    }
  };

  // Suppression d'un article du panier
  const handleDelete = (id: string | number) => {
    removeCartItem(String(id));
  };

  return (
    <Container className="py-12">
      <div className="space-y-6">
        {/* Section Panier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Typography
              variant="h4"
              className="bg-primary text-white text-fold shadow w-full p-3 rounded-lg"
            >
              1. Contenu de votre panier
            </Typography>

            <div className="bg-primary-1 space-y-4 shadow w-full p-6 rounded-lg mt-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-primary pb-4 last:border-none"
                >
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
                      <Typography variant="h4" className="truncate text-primary">
                        {item.alt}
                      </Typography>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition duration-200"
                        aria-label="Supprimer l'article"
                      >
                        <RiDeleteBinLine size={24} className="text-primary" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <Typography variant="body">
                        Taille : <span className="text-gray-600">{item.selectedSize}</span>
                      </Typography>
                      <Typography variant="body">
                        Couleur : <span className="text-gray-600">{item.selectedColor}</span>
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
                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
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
            <Typography variant="h4" className="bg-primary text-white text-fold shadow w-full p-3 rounded-lg">
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
            <Typography variant="body-base" component="p" className="text-justify text-gray-3">
              Effectuez votre paiement directement sur notre compte bancaire.
              Veuillez utiliser votre identifiant de commande comme référence de paiement.
              Votre commande ne sera expédiée qu{"'"}une fois les fonds crédités sur notre compte.
            </Typography>

            <Typography variant="body-base" component="p" className="text-justify text-gray-3">
              Vos données personnelles seront utilisées pour gérer votre expérience sur ce site,
              gérer l{"'"}accès à votre compte et pour d{"'"}autres fins décrites dans notre
              <span className="font-weight-bold"> politique de confidentialité</span>.
            </Typography>

            {/* Bouton de paiement par compte bancaire */}
            {
              !showBankForm && (
                <Button
          action={() => setShowBankForm(true)}
          className="w-full px-4 py-2 text-white bg-secondary rounded hover:bg-secondary-dark"
        >
          COMPTE BANCAIRE
        </Button>
              )
            }
            

        {showBankForm && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <Typography variant="h4" className="mb-2">Informations Bancaires</Typography>
            <input
              type="text"
              name="name"
              placeholder="Nom de la banque"
              value={bankDetails.name}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="iban"
              placeholder="IBAN"
              value={bankDetails.iban}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="bic"
              placeholder="BIC"
              value={bankDetails.bic}
              onChange={handleInputChange}
              className="w-full p-2 mb-2 border rounded"
            />
            <Button action={handleBankPayment} isLoading={isLoading} className="w-full px-4 py-2 text-white bg-secondary rounded hover:bg-secondary-dark">
              Valider le paiement
            </Button>
          </div>
        )}
            {/* Bouton de commande */}
            <Button
              action={onSubmit}
              isLoading={isLoading}
              className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark"
            >
              PAYPAL
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutContainer;
