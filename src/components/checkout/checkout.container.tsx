/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { useCheckout } from "@/hooks/useCheckout";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiMinus, FiPlus } from "react-icons/fi";
import PaymentCheckout from "./PaymentCheckout";

const CheckoutContainer = () => {
 const {
   handleDelete,
   handleQuantityChange,
   calculateTotal,
   cart
 } = useCheckout();
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
    <Container className="py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* ================= PANIER ================= */}
        <div className="space-y-6 lg:col-span-2">
          <Typography variant="h3" className="font-bold">
            Votre panier
          </Typography>

          <div className="space-y-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-xl shadow-sm transition hover:shadow-md">
                {/* Image */}
                <div className="overflow-hidden relative w-24 h-24 bg-gray-100 rounded-lg">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    layout="responsive"
                    width={381}
                    height={450}
                    objectFit="cover"
                    // className="rounded-lg shadow-lg"
                    className="object-cover"
                  />
                </div>

                {/* Infos */}
                <div className="flex flex-col flex-1 justify-between">
                  <div className="flex justify-between">
                    <div>
                      <Typography
                        variant="h4"
                        className="font-semibold text-gray-900">
                        {item.alt}
                      </Typography>

                      <Typography variant="body" className="mt-1 text-gray-500">
                        Taille : {item.selectedSize} · Couleur :{" "}
                        {item.selectedColor}
                      </Typography>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 transition hover:text-red-500"
                      aria-label="Supprimer l'article">
                      <RiDeleteBinLine size={22} />
                    </button>
                  </div>

                  {/* Prix + Quantité */}
                  <div className="flex justify-between items-center mt-4">
                    <Typography className="text-lg font-bold text-primary">
                      € {item.prix.toFixed(2)}
                    </Typography>

                    <div className="flex overflow-hidden items-center rounded-lg border">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Number(item.quantity) - 1
                          )
                        }
                        disabled={Number(item.quantity) <= 1}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-40">
                        <FiMinus />
                      </button>

                      <span className="px-4 font-medium">{item.quantity}</span>

                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Number(item.quantity) + 1
                          )
                        }
                        className="px-3 py-1 hover:bg-gray-100">
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RÉCAP / PAIEMENT ================= */}
        <div className="sticky top-24 space-y-6 h-fit">
          <div className="p-6 space-y-4 bg-white rounded-xl border border-gray-100 shadow-lg">
            <Typography variant="h4" className="mb-4 font-bold text-gray-900">
              Récapitulatif de commande
            </Typography>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Sous-total</span>
                <span className="font-semibold">
                  € {calculateTotal().toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Livraison</span>
                <span className="font-semibold text-green-600">Gratuite</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between pt-2 text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-xl text-primary">
                  € {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>

            {/* Info de sécurité */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex gap-2 items-center text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-green-600"
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

          {/* Formulaire de paiement personnalisé avec Stripe Elements */}
          <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-lg">
            <Typography variant="h4" className="mb-4 font-bold text-gray-900">
              Informations de paiement
            </Typography>
            <PaymentCheckout />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutContainer;
