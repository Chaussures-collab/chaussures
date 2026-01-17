/** @format */

import emailjs from "emailjs-com";

/**
 * Service d'email utilisant EmailJS
 * Configuration: https://www.emailjs.com/
 *
 * Variables d'environnement requises:
 * - NEXT_PUBLIC_EMAILJS_SERVICE_ID: ID du service EmailJS
 * - NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: ID du template d'email
 * - NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: Clé publique EmailJS
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
}

export class EmailJSService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;
  private isInitialized: boolean = false;

  constructor() {
    this.serviceId =
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    this.templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    this.publicKey =
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";

    if (this.serviceId && this.templateId && this.publicKey) {
      emailjs.init(this.publicKey);
      this.isInitialized = true;
      console.log("✅ [EmailJSService] Initialisé avec succès");
    } else {
      console.warn("⚠️ [EmailJSService] Configuration incomplète - vérifiez les variables d'environnement");
    }
  }

  /**
   * Envoie un email via EmailJS
   */
  async sendEmail(options: EmailOptions): Promise<{success: boolean; messageId?: string; error?: string}> {
    if (!this.isInitialized) {
      return {
        success: false,
        error: "EmailJS n'est pas correctement configuré"
      };
    }

    try {
      console.log(
        `📧 [EmailJSService] Envoi d'email à ${options.to}...`
      );

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        {
          to_email: options.to,
          subject: options.subject,
          message: options.html,
          message_text: options.text || "",
          from_name: options.fromName || "Snipersmarket"
        },
        this.publicKey
      );

      console.log(
        `✅ [EmailJSService] Email envoyé avec succès (ID: ${response.status})`
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
        `❌ [EmailJSService] Erreur lors de l'envoi: ${errorMessage}`
      );

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * Envoie un email de confirmation de commande
   */
  async sendOrderConfirmation(
    userEmail: string,
    orderId: string,
    orderData: {
      totalAmount: number;
      currency: string;
      items: Array<{name: string; quantity: number; price: number}>;
    }
  ): Promise<{success: boolean; messageId?: string; error?: string}> {
    const itemsList = orderData.items
      .map(
        (item) =>
          `- ${item.name} x${item.quantity} = ${(item.price * item.quantity).toFixed(2)} ${orderData.currency}`
      )
      .join("<br/>");

    const html = `
      <h2>Confirmation de commande</h2>
      <p>Votre commande #${orderId} a été reçue avec succès!</p>
      <h3>Détails de la commande:</h3>
      <ul>
        <li><strong>Commande ID:</strong> ${orderId}</li>
        <li><strong>Montant total:</strong> ${orderData.totalAmount.toFixed(2)} ${orderData.currency}</li>
      </ul>
      <h3>Articles:</h3>
      <p>${itemsList}</p>
      <p>Merci pour votre achat!</p>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: `Confirmation de commande #${orderId}`,
      html,
      text: `Confirmation de commande #${orderId}\n\nMontant: ${orderData.totalAmount} ${orderData.currency}\n\nMerci pour votre achat!`
    });
  }

  /**
   * Envoie un email de rappel panier abandonné
   */
  async sendAbandonedCartReminder(
    userEmail: string,
    cartTotal: number,
    cartUrl: string
  ): Promise<{success: boolean; messageId?: string; error?: string}> {
    const html = `
      <h2>Vous avez oublié votre panier!</h2>
      <p>Nous avons remarqué que vous avez laissé des articles dans votre panier.</p>
      <h3>Montant du panier: ${cartTotal.toFixed(2)} €</h3>
      <p><a href="${cartUrl}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Finaliser votre achat</a></p>
      <p>Cette offre expire dans 24 heures.</p>
    `;

    return this.sendEmail({
      to: userEmail,
      subject: "Vous avez oublié votre panier!",
      html,
      text: `Vous avez oublié votre panier!\n\nMontant: ${cartTotal.toFixed(2)} €\n\nRetournez sur le site pour finaliser votre achat.`
    });
  }

  /**
   * Envoie un email de contact (formulaire)
   */
  async sendContactEmail(
    senderEmail: string,
    senderName: string,
    subject: string,
    message: string
  ): Promise<{success: boolean; messageId?: string; error?: string}> {
    const html = `
      <h3>Nouveau message de contact</h3>
      <p><strong>De:</strong> ${senderName} (${senderEmail})</p>
      <p><strong>Sujet:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    return this.sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@snipersmarket.fr",
      subject: `[Contact] ${subject}`,
      html,
      fromName: senderName
    });
  }

  /**
   * Vérifie la configuration EmailJS
   */
  isConfigured(): boolean {
    return this.isInitialized;
  }

  /**
   * Retourne le statut de la configuration
   */
  getStatus(): {
    isInitialized: boolean;
    serviceId: string;
    templateId: string;
    hasPublicKey: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      serviceId: this.serviceId ? "✅" : "❌",
      templateId: this.templateId ? "✅" : "❌",
      hasPublicKey: !!this.publicKey
    };
  }
}
