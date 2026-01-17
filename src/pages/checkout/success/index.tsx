/**
 * eslint-disable @typescript-eslint/no-explicit-any
 *
 * @format
 */

/** @format */

import Layout from "@/ui/components/layout/layout";
import Seo from "@/ui/components/seo/seo";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cartContext";
import { useEmailJS } from "@/hooks/useEmailJS";
import { useSearchParams } from "next/navigation";
import { db } from "@/config/firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

/**
 * Page de succès du paiement
 * Envoie un email via EmailJS (fallback côté client si Sendgrid a échoué)
 */
export default function SuccessPage() {
  const cart = useCart();
  const {
    sendOrderConfirmation,
    sendAdminAlert,
    isReady: isEmailJSReady
  } = useEmailJS();
  const searchParams = useSearchParams();
  const [emailStatus, setEmailStatus] = useState<{
    status: "pending" | "success" | "error";
    message: string;
  }>({
    status: "pending",
    message: "Envoi de votre confirmation..."
  });
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      if (processed) return;

      try {
        // Vider le panier
        if (cart?.cart && cart.cart.length > 0) {
          cart.cart.forEach((item) => {
            cart.removeCartItem(String(item.id));
          });
          console.log("✅ Panier vidé après paiement réussi");
        }

        // Attendre un peu pour que EmailJS soit chargé
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Essayer obtenir orderId depuis sessionStorage (Stripe ne passe pas de query params)
        let orderId = searchParams?.get("orderId");
        if (!orderId && typeof window !== "undefined") {
          orderId = sessionStorage.getItem("lastOrderId");
          console.log(
            `📧 [SuccessPage] orderId from sessionStorage: ${orderId}`
          );
        }

        if (!orderId) {
          console.warn(`⚠️ [SuccessPage] orderId non trouvé`);
          setEmailStatus({
            status: "pending",
            message: "Commande reçue. Email non nécessaire."
          });
          setProcessed(true);
          return;
        }

        // Récupérer les données de la commande depuis Firestore
        let orderData = null;
        try {
          // Essayer d'abord récupérer directement par doc ID (orderId EST la doc ID)
          const orderDocRef = doc(db, "orders", orderId);
          const orderDocSnap = await getDoc(orderDocRef);
          let querySnapshot: any = null;

          if (orderDocSnap.exists()) {
            // Simuler querySnapshot pour la cohérence du code
            querySnapshot = {
              empty: false,
              docs: [{ data: () => orderDocSnap.data(), id: orderDocSnap.id }]
            };
          } else {
            // Fallback: chercher par le champ 'id'
            const ordersRef = collection(db, "orders");
            const q = query(ordersRef, where("id", "==", orderId));
            querySnapshot = await getDocs(q);
          }

          if (!querySnapshot.empty) {
            const orderDoc = querySnapshot.docs[0];
            const firestoreOrder = orderDoc.data();

            console.log(
              `✅ [SuccessPage] Commande trouvée dans Firestore:`,
              firestoreOrder
            );

            orderData = {
              orderId: firestoreOrder.id || firestoreOrder.orderId || orderId,
              userEmail: firestoreOrder.userEmail || firestoreOrder.email,
              customerName:
                firestoreOrder.customerName || firestoreOrder.name || "Client",
              items: firestoreOrder.items || [],
              totalAmount:
                firestoreOrder.totalAmount || firestoreOrder.total || 0,
              orderDate: new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })
            };
          } else {
            // Fallback: utiliser searchParams ou valeurs par défaut
            console.warn(
              `⚠️ [SuccessPage] Commande non trouvée dans Firestore`
            );
            const userEmail = searchParams?.get("email");
            const customerName = searchParams?.get("name") || "Client";
            const totalAmount = Number.parseFloat(
              searchParams?.get("amount") || "0"
            );
            const itemsJson = searchParams?.get("items");
            let items = [];

            try {
              if (itemsJson) {
                items = JSON.parse(decodeURIComponent(itemsJson));
              }
            } catch (parseError) {
              console.warn("⚠️ Erreur parsing items:", parseError);
              items = [];
            }

            if (userEmail) {
              orderData = {
                orderId,
                userEmail,
                customerName,
                items:
                  items && items.length > 0
                    ? items
                    : [
                        {
                          name: "Article acheté",
                          quantity: 1,
                          price: totalAmount
                        }
                      ],
                totalAmount,
                orderDate: new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              };
            }
          }
        } catch (firestoreError) {
          console.error(`❌ [SuccessPage] Erreur Firestore:`, firestoreError);
          // Continuer avec searchParams en fallback
          const userEmail = searchParams?.get("email");
          const customerName = searchParams?.get("name") || "Client";
          const totalAmount = Number.parseFloat(
            searchParams?.get("amount") || "0"
          );

          if (userEmail) {
            orderData = {
              orderId,
              userEmail,
              customerName,
              items: [
                { name: "Article acheté", quantity: 1, price: totalAmount }
              ],
              totalAmount,
              orderDate: new Date().toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })
            };
          }
        }

        // Vérifier que nous avons l'email
        if (!orderData || !orderData.userEmail) {
          console.warn(
            `⚠️ [SuccessPage] Email manquant pour la commande ${orderId}`
          );
          setEmailStatus({
            status: "pending",
            message: "Commande reçue. Email non nécessaire."
          });
          setProcessed(true);
          return;
        }

        console.log(`📧 [SuccessPage] Données de commande prêtes:`, orderData);

        // Essayer EmailJS (fallback côté client)
        if (isEmailJSReady) {
          console.log(
            `📧 [SuccessPage] EmailJS prêt - envoi de la confirmation...`
          );
          const result = await sendOrderConfirmation(orderData);

          if (result.success) {
            console.log(
              `✅ [SuccessPage] Email de confirmation envoyé via EmailJS`
            );
            setEmailStatus({
              status: "success",
              message: "✅ Confirmation envoyée par email!"
            });
          } else {
            console.warn(`⚠️ [SuccessPage] Erreur EmailJS: ${result.error}`);
            setEmailStatus({
              status: "error",
              message: `⚠️ Email non envoyé: ${
                result.error || "Erreur inconnue"
              }`
            });
          }

          // Envoyer alerte admin (optionnel)
          try {
            await sendAdminAlert(orderData);
            console.log("✅ Alerte admin envoyée");
          } catch (err) {
            console.warn("⚠️ Alerte admin échouée:", err);
          }
        } else {
          console.warn(
            `⚠️ [SuccessPage] EmailJS pas prêt - vérifiez la configuration`
          );
          setEmailStatus({
            status: "pending",
            message: "Commande reçue. Confirmation en cours..."
          });
        }
      } catch (error) {
        console.error(`❌ [SuccessPage] Erreur lors du traitement:`, error);
        setEmailStatus({
          status: "error",
          message: "Erreur lors du traitement"
        });
      } finally {
        setProcessed(true);
      }
    };

    processPaymentSuccess();
  }, [
    isEmailJSReady,
    searchParams,
    cart,
    sendOrderConfirmation,
    sendAdminAlert,
    processed
  ]);

  return (
    <>
      <Seo
        title="Paiement réussi - SnipersMarket"
        description="Votre commande a été validée avec succès."
      />

      <Layout isDisplayCreadCrumbs={false}>
        <div className="text-center py-20 min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-4">🎉 Paiement réussi!</h1>
          <p className="text-lg mb-8">
            Votre commande a été créée avec succès.
          </p>

          {emailStatus && (
            <div
              className={`mt-6 p-4 rounded border ${
                emailStatus.status === "success"
                  ? "bg-green-100 border-green-400"
                  : emailStatus.status === "error"
                  ? "bg-red-100 border-red-400"
                  : "bg-blue-100 border-blue-400"
              }`}>
              <p
                className={
                  emailStatus.status === "success"
                    ? "text-green-800"
                    : emailStatus.status === "error"
                    ? "text-red-800"
                    : "text-blue-800"
                }>
                {emailStatus.message}
              </p>
            </div>
          )}

          <p className="mt-8 text-sm text-gray-600 max-w-md">
            Une confirmation a été envoyée à votre adresse email. Vous pouvez
            consulter l{"'"}état de votre commande dans votre profil.
          </p>
        </div>
      </Layout>
    </>
  );
}
