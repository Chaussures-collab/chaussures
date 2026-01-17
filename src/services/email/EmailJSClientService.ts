/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */

/**
 * Service EmailJS côté CLIENT (navigateur uniquement)
 * Utilise la libraire emailjs chargée via CDN dans _document.tsx
 *
 * Configuration requise:
 * - NEXT_PUBLIC_EMAILJS_SERVICE_ID: ID du service EmailJS
 * - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: ID du template d'email
 * - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: Clé publique EmailJS
 */

export interface OrderEmailData {
  orderId: string;
  userEmail: string;
  customerName: string;
  items: Array<{name: string; quantity: number; price: number}>;
  totalAmount: number;
  orderDate?: string;
}

export class EmailJSClientService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private isInitialized: boolean = false;
  private emailjs: any = null;

  constructor() {
    this.serviceId =
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    this.templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    this.publicKey =
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    // Vérifier que EmailJS est chargé via CDN
    if (typeof window !== "undefined" && (window as any).emailjs) {
      this.emailjs = (window as any).emailjs;

      if (this.serviceId && this.templateId && this.publicKey) {
        this.emailjs.init(this.publicKey);
        this.isInitialized = true;
        console.log("✅ [EmailJSClientService] Initialisé avec succès");
      } else {
        console.warn(
          "⚠️ [EmailJSClientService] Configuration incomplète - vérifiez les variables d'environnement"
        );
      }
    } else {
      console.warn(
        "⚠️ [EmailJSClientService] EmailJS non chargé (normal côté serveur, sera disponible côté client)"
      );
    }
  }

  /**
   * Vérifier si le service est configuré et disponible
   */
  isConfigured(): boolean {
    return (
      this.isInitialized &&
      typeof window !== "undefined" &&
      !!(window as any).emailjs
    );
  }

  /**
   * Envoyer un email de confirmation de commande
   */
  async sendOrderConfirmation(
    orderData: OrderEmailData
  ): Promise<{success: boolean; messageId?: string; error?: string}> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "EmailJS non disponible"
      };
    }

    try {
      console.log(
        `📧 [EmailJSClientService] Envoi email de confirmation à ${orderData.userEmail}...`
      );

      const itemsList = orderData.items
        .map(
          (item) =>
            `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€`
        )
        .join("\n");

      const emailTemplate = {
        to_email: orderData.userEmail,
        to_name: orderData.customerName,
        subject: `Confirmation de votre commande #${orderData.orderId}`,
        order_id: orderData.orderId,
        customer_name: orderData.customerName,
        items_list: itemsList,
        total_amount: orderData.totalAmount.toFixed(2),
        order_date:
          orderData.orderDate ||
          new Date().toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric"
          }),
        message: `Bonjour ${orderData.customerName},\n\nVotre commande #${orderData.orderId} a été reçue et payée avec succès.\n\nArticles:\n${itemsList}\n\nTotal: ${orderData.totalAmount.toFixed(2)}€\n\nMerci pour votre achat!`
      };

      const response = await this.emailjs.send(
        this.serviceId,
        this.templateId,
        emailTemplate
      );

      console.log(
        `✅ [EmailJSClientService] Email envoyé avec succès (ID: ${response.status})`
      );

      return {
        success: true,
        messageId: String(response.status)
      };
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";

      console.error(
        `❌ [EmailJSClientService] Erreur lors de l'envoi: ${errorMessage}`
      );

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Envoyer un email d'alerte admin
   */
  async sendAdminAlert(
    orderData: OrderEmailData
  ): Promise<{success: boolean; messageId?: string; error?: string}> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "EmailJS non disponible"
      };
    }

    try {
      console.log(
        `📧 [EmailJSClientService] Envoi alerte admin pour commande #${orderData.orderId}...`
      );

      const itemsList = orderData.items
        .map(
          (item) =>
            `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€`
        )
        .join("\n");

      const adminEmail = {
        to_email:
          process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
          process.env.ADMIN_EMAIL ||
          "admin@example.com",
        subject: `[ALERT] Nouvelle commande #${orderData.orderId}`,
        order_id: orderData.orderId,
        customer_email: orderData.userEmail,
        customer_name: orderData.customerName,
        items_list: itemsList,
        total_amount: orderData.totalAmount.toFixed(2),
        message: `Nouvelle commande reçue!\n\nCommande: #${orderData.orderId}\nClient: ${orderData.customerName} (${orderData.userEmail})\nMontant: ${orderData.totalAmount.toFixed(2)}€\n\nArticles:\n${itemsList}`
      };

      const response = await this.emailjs.send(
        this.serviceId,
        this.templateId,
        adminEmail
      );

      console.log(
        `✅ [EmailJSClientService] Alerte admin envoyée (ID: ${response.status})`
      );

      return {
        success: true,
        messageId: String(response.status)
      };
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";

      console.error(
        `❌ [EmailJSClientService] Erreur lors de l'envoi de l'alerte admin: ${errorMessage}`
      );

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Envoyer un rappel de panier abandonné
   */
  async sendAbandonedCartReminder(
    email: string,
    cartData: {
      items: Array<{name: string; quantity: number; price: number}>;
      total: number;
    }
  ): Promise<{success: boolean; messageId?: string; error?: string}> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: "EmailJS non disponible"
      };
    }

    try {
      console.log(
        `📧 [EmailJSClientService] Envoi rappel panier abandonné à ${email}...`
      );

      const itemsList = cartData.items
        .map(
          (item) =>
            `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)}€`
        )
        .join("\n");

      const cartEmail = {
        to_email: email,
        subject: "Vous avez oublié des articles dans votre panier 🛒",
        items_list: itemsList,
        cart_total: cartData.total.toFixed(2),
        message: `Bonjour,\n\nVous avez laissé ${cartData.items.length} article(s) dans votre panier pour un total de ${cartData.total.toFixed(2)}€.\n\nArticles:\n${itemsList}\n\nComplétez votre achat maintenant!`
      };

      const response = await this.emailjs.send(
        this.serviceId,
        this.templateId,
        cartEmail
      );

      console.log(
        `✅ [EmailJSClientService] Rappel panier envoyé (ID: ${response.status})`
      );

      return {
        success: true,
        messageId: String(response.status)
      };
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";

      console.error(
        `❌ [EmailJSClientService] Erreur lors de l'envoi du rappel: ${errorMessage}`
      );

      return {
        success: false,
        error: errorMessage
      };
    }
  }
}

export default EmailJSClientService;
