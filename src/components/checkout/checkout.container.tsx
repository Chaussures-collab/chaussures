/** @format */

import Container from "@/ui/components/container/container";
import Typography from "@/ui/designSystem/typography/typography";
import Button from "@/ui/designSystem/button/button";
import { useCheckout } from "@/hooks/useCheckout";
import Image from "next/image";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiMinus, FiPlus } from "react-icons/fi";

const CheckoutContainer = () => {
  const {
    cart,
    calculateTotal,
    handleDelete,
    handleQuantityChange,
    isLoading,
    handleStripeCheckout
  } = useCheckout();
if (cart.length === 0) {
  return (
    <Container className="py-24">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-32 h-32 flex items-center justify-center rounded-full bg-primary-50">
          🛒
        </div>

        <Typography variant="h3" className="font-bold">
          Votre panier est vide
        </Typography>

        <Typography variant="body" className="text-gray-500 max-w-md">
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* ================= PANIER ================= */}
        <div className="lg:col-span-2 space-y-6">
          <Typography variant="h3" className="font-bold">
            Votre panier
          </Typography>

          <div className="space-y-5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                {/* Image */}
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Infos */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <Typography
                        variant="h4"
                        className="font-semibold text-gray-900">
                        {item.alt}
                      </Typography>

                      <Typography variant="body" className="text-gray-500 mt-1">
                        Taille : {item.selectedSize} · Couleur :{" "}
                        {item.selectedColor}
                      </Typography>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-500 transition"
                      aria-label="Supprimer l'article">
                      <RiDeleteBinLine size={22} />
                    </button>
                  </div>

                  {/* Prix + Quantité */}
                  <div className="flex items-center justify-between mt-4">
                    <Typography className="text-lg font-bold text-primary">
                      € {item.prix.toFixed(2)}
                    </Typography>

                    <div className="flex items-center border rounded-lg overflow-hidden">
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
        <div className="sticky top-24 h-fit space-y-6">
          <div className="p-6 bg-primary-50 rounded-xl shadow-sm space-y-4">
            <Typography variant="h4" className="font-bold">
              Récapitulatif
            </Typography>

            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>€ {calculateTotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span className="text-green-600">Gratuite</span>
            </div>

            <hr />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">
                € {calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            action={handleStripeCheckout}
            isLoading={isLoading}
            className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary-dark transition">
            Payer en toute sécurité
          </Button>

          <Typography
            variant="body"
            className="text-center text-gray-400 text-sm">
            Paiement sécurisé via Stripe
          </Typography>
        </div>
      </div>
    </Container>
  );
};

export default CheckoutContainer;
