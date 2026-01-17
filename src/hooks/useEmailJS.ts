/** @format */

import { useEffect, useState } from "react";
import EmailJSClientService, {
  OrderEmailData
} from "@/services/email/EmailJSClientService";

/**
 * Hook pour gérer les emails EmailJS côté client
 * EmailJS est chargé via CDN dans _document.tsx
 * Utilisé comme fallback après un paiement réussi
 */
export function useEmailJS() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailService, setEmailService] = useState<EmailJSClientService | null>(
    null
  );

  // Initialiser EmailJS une seule fois quand le CDN est prêt
  useEffect(() => {
    // Vérifier que window.emailjs est disponible (chargé via CDN)
    const checkEmailJS = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== "undefined" && (window as any).emailjs) {
        console.log("✅ [useEmailJS] EmailJS CDN chargé, initialisation...");
        clearInterval(checkEmailJS);

        const service = new EmailJSClientService();

        if (service.isConfigured()) {
          setEmailService(service);
          setIsReady(true);
          console.log("✅ [useEmailJS] EmailJS prêt");
        } else {
          console.warn("⚠️ [useEmailJS] EmailJS non configuré");
          setIsReady(false);
        }
      }
    }, 100);

    // Timeout: arrêter la vérification après 5 secondes
    setTimeout(() => {
      clearInterval(checkEmailJS);
      if (!emailService) {
        console.warn("⚠️ [useEmailJS] EmailJS non chargé après 5s");
        setIsReady(false);
      }
    }, 5000);

    return () => clearInterval(checkEmailJS);
  }, [emailService]);

  /**
   * Envoyer l'email de confirmation de commande
   */
  const sendOrderConfirmation = async (
    orderData: OrderEmailData
  ): Promise<{success: boolean; error?: string}> => {
    if (!emailService || !emailService.isConfigured()) {
      const errorMsg = "EmailJS non disponible";
      console.error(`❌ [useEmailJS] ${errorMsg}`);
      return {success: false, error: errorMsg};
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `📧 [useEmailJS] Envoi de la confirmation de commande #${orderData.orderId}`
      );
      const result = await emailService.sendOrderConfirmation(orderData);

      if (result.success) {
        console.log(
          `✅ [useEmailJS] Email de confirmation envoyé avec succès`
        );
        return {success: true};
      } else {
        console.error(
          `❌ [useEmailJS] Erreur lors de l'envoi:`,
          result.error
        );
        setError(result.error || "Erreur lors de l'envoi");
        return {success: false, error: result.error};
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur inconnue";
      console.error(`❌ [useEmailJS] Exception:`, err);
      setError(errorMsg);
      return {success: false, error: errorMsg};
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Envoyer l'alerte admin
   */
  const sendAdminAlert = async (
    orderData: OrderEmailData
  ): Promise<{success: boolean; error?: string}> => {
    if (!emailService || !emailService.isConfigured()) {
      const errorMsg = "EmailJS non disponible";
      console.error(`❌ [useEmailJS] ${errorMsg}`);
      return {success: false, error: errorMsg};
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📧 [useEmailJS] Envoi de l'alerte admin`);
      const result = await emailService.sendAdminAlert(orderData);

      if (result.success) {
        console.log(`✅ [useEmailJS] Alerte admin envoyée`);
        return {success: true};
      } else {
        console.error(
          `❌ [useEmailJS] Erreur lors de l'envoi de l'alerte:`,
          result.error
        );
        // L'alerte admin est optionnelle - on ne met pas en erreur
        return {success: false, error: result.error};
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur inconnue";
      console.error(`❌ [useEmailJS] Exception alerte admin:`, err);
      // L'alerte admin est optionnelle
      return {success: false, error: errorMsg};
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Envoyer un rappel de panier abandonné
   */
  const sendAbandonedCartReminder = async (
    email: string,
    cartData: {items: Array<{name: string; quantity: number; price: number}>; total: number}
  ): Promise<{success: boolean; error?: string}> => {
    if (!emailService || !emailService.isConfigured()) {
      const errorMsg = "EmailJS non disponible";
      console.error(`❌ [useEmailJS] ${errorMsg}`);
      return {success: false, error: errorMsg};
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`📧 [useEmailJS] Envoi du rappel de panier abandonné`);
      const result = await emailService.sendAbandonedCartReminder(
        email,
        cartData
      );

      if (result.success) {
        console.log(`✅ [useEmailJS] Rappel panier envoyé`);
        return {success: true};
      } else {
        console.error(
          `❌ [useEmailJS] Erreur lors de l'envoi du rappel:`,
          result.error
        );
        return {success: false, error: result.error};
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur inconnue";
      console.error(`❌ [useEmailJS] Exception rappel panier:`, err);
      return {success: false, error: errorMsg};
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isReady,
    isLoading,
    error,
    sendOrderConfirmation,
    sendAdminAlert,
    sendAbandonedCartReminder
  };
}
