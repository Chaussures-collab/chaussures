/** @format */

import Container from "@/ui/components/container/container";
//import { Input } from "@/ui/designSystem/forms/input";
import Typography from "@/ui/designSystem/typography/typography";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/context/cartContext";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";

interface FormData {
  nom: string;
  prenom: string;
  nomEntreprise: string;
  continent: string;
  adresseRue: string;
  ville: string;
  province: string;
  codePostal: string;
  numeroTelephone: string;
  adresseMail: string;
  banque: string; // Nouveau champ pour la banque
  numeroCompteBancaire: string; // Nouveau champ pour le numéro de compte bancaire
  identifiantCommande: string; // Nouveau champ pour l'identifiant de commande
}

const CheckoutContainer = () => {
  const { handleSubmit } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Données soumises :", data);
  };

  //const { calculateTotalPromoPrice } = useCart(); // Gestion via le contexte
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<Record<string, unknown> | null>(null);

  const { cart, updateCartItem, removeCartItem } = useCart(); // Gestion via le contexte

  const calculateTotal = () => {
    return cart.reduce(
      (acc, item) =>
        acc + (Number(item.prix) || 0) * (Number(item.quantity) || 0),
      0
    );
  };

  const handleQuantityChange = (id: string | number, value: number) => {
    if (value > 0) {
      updateCartItem(String(id), value); // Conversion explicite en string
    }
  };

  const handleDelete = (id: string | number) => {
    removeCartItem(String(id)); // Conversion explicite en string
  };

  console.log(cart);

  return (
    <Container className="py-12">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Typography variant="h4" className="bg-primary text-white text-fold shadow w-full p-3 rounded-lg">1. Contenu de votre panier</Typography>
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
                      <Typography
                        variant="h4"
                        className="truncate text-primary"
                      >
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
                        Taille :{" "}
                        <span className="text-gray-600">
                          {item.selectedSize}
                        </span>
                      </Typography>
                      <Typography variant="body">
                        Couleur :{" "}
                        <span className="text-gray-600">
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
            <div>
              <div className="flex justify-between">
                <Typography variant="h4" component="h4">
                  Total
                </Typography>
                <Typography variant="h4" component="h4" theme="primary">
                  {calculateTotal()}
                </Typography>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Typography variant="h4" className="bg-primary text-white text-fold shadow w-full p-3 rounded-lg">2. Mode de paiement</Typography>
              <div className="flex justify-between">
                <Typography variant="h4" component="h4">
                  Produits
                </Typography>
                <Typography variant="h4" component="h4">
                  Totals
                </Typography>
              </div>
              <div className="flex justify-between mt-2">
                <Typography variant="body" component="span">
                  Total
                </Typography>
                <Typography variant="body" component="span" theme="primary">
                  {calculateTotal()}
                </Typography>
              </div>
            </div>

            <hr className="border-gray-3" />

            <Typography
              variant="body-base"
              component="p"
              className="text-justify text-gray-3"
            >
              Effectuez votre paiement directement sur notre compte bancaire.
              Veuillez utiliser votre identifiant de commande comme référence de
              paiement. Votre commande ne sera expédiée qu{"'"}une fois les
              fonds crédités sur notre compte.
            </Typography>

            <Typography
              variant="body-base"
              component="p"
              className="text-justify text-gray-3"
            >
              Vos données personnelles seront utilisées pour soutenir votre
              expérience sur ce site web, gérer l{"'"}accès à votre compte et
              pour d{"'"}autres fins décrites dans notre
              <span className="font-weight-bold">
                politique de confidentialité
              </span>
              .
            </Typography>

            {/* Bouton de commande 
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary rounded hover:bg-primary-dark"
            >
              PASSER COMMANDE
            </button>*/}
            <div>
              <h2>Payer avec PayPal</h2>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: "20.00"
                        }
                      }
                    ]
                  });
                }}
                onApprove={async (data, actions) => {
                  if (!actions || !actions.order) {
                    console.error("Actions PayPal non définies.");
                    return;
                  }

                  return actions.order.capture().then((details) => {
                    // Utiliser la nouvelle API pour récupérer le nom du client
                    const payerName =
                      details.payment_source?.paypal?.name?.given_name ||
                      "Client";

                    setSuccess(true);
                    alert(`Paiement réussi, merci ${payerName} !`);
                  });
                }}
                onError={(err) => {
                  setError(err);
                  console.error("Erreur PayPal:", err);
                }}
              />

              {success && <p>✅ Paiement réussi !</p>}
              {error && <p>❌ Une erreur s{"'"}est produite.</p>}
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
};

export default CheckoutContainer;
