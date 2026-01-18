/** @format */

import sgMail from "@sendgrid/mail";

/**
 * Service d'email utilisant Sendgrid
 * Configuration: https://sendgrid.com/
 *
 * Variables d'environnement requises:
 * - SENDGRID_API_KEY: Clé API Sendgrid
 * - SENDGRID_FROM_EMAIL: Email expéditeur (vérifié sur Sendgrid)
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  fromName?: string;
}

export class SendgridEmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string = "Snipersmarket";
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || "";
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || "";

    if (this.apiKey && this.fromEmail) {
      sgMail.setApiKey(this.apiKey);
      this.isInitialized = true;
      console.log("✅ [SendgridEmailService] Initialisé avec succès");
    } else {
      console.warn(
        "⚠️ [SendgridEmailService] Configuration incomplète - vérifiez SENDGRID_API_KEY et SENDGRID_FROM_EMAIL"
      );
    }
  }

  /**
   * Vérifier si le service est configuré
   */
  isConfigured(): boolean {
    return this.isInitialized;
  }

  /**
   * Obtenir le statut du service
   */
  getStatus(): string {
    if (!this.isInitialized) {
      return "Non configuré";
    }
    return "Prêt";
  }

  /**
   * Envoie un email via Sendgrid
   */
  async sendEmail(options: EmailOptions): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    if (!this.isInitialized) {
      const errorMsg = "Sendgrid n'est pas correctement configuré";
      console.error(`❌ [SendgridEmailService] ${errorMsg}`);
      return {
        success: false,
        error: errorMsg
      };
    }

    try {
      console.log(
        `📧 [SendgridEmailService] Envoi d'email à ${options.to}...`
      );

      const msg = {
        to: options.to,
        from: {
          email: this.fromEmail,
          name: options.fromName || this.fromName
        },
        subject: options.subject,
        html: options.html,
        text: options.text || ""
      };

      const response = await sgMail.send(msg);

      console.log(
        `✅ [SendgridEmailService] Email envoyé avec succès (ID: ${response[0].headers["x-message-id"]})`
      );

      return {
        success: true,
        messageId: response[0].headers["x-message-id"]
      };
    } catch (error) {
      const errorMessage =
        error && typeof error === "object" && "message" in error
          ? String(error.message)
          : "Erreur inconnue";

      console.error(
        `❌ [SendgridEmailService] Erreur lors de l'envoi: ${errorMessage}`
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
  async sendOrderConfirmation(orderEmailData: {
    userEmail: string;
    orderId: string;
    orderDate: string;
    items: Array<{name: string; quantity: number; price: number}>;
    totalAmount: number;
    customerName: string;
  }): Promise<{success: boolean; messageId?: string; error?: string}> {
    const itemsList = orderEmailData.items
      .map(
        (item) =>
          `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price.toFixed(2)}€</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${(item.quantity * item.price).toFixed(2)}€</td>
      </tr>
      `
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #333; margin: 0;">Confirmation de commande</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Commande #${orderEmailData.orderId}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="color: #333; font-size: 16px;">Bonjour ${orderEmailData.customerName},</p>
          <p style="color: #666; line-height: 1.6;">
            Nous avons bien reçu votre commande le <strong>${orderEmailData.orderDate}</strong>.
            Vous trouverez ci-dessous le détail de votre commande.
          </p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #ddd;">Produit</th>
              <th style="padding: 12px; text-align: center; font-weight: bold; border-bottom: 2px solid #ddd;">Quantité</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; border-bottom: 2px solid #ddd;">Prix unitaire</th>
              <th style="padding: 12px; text-align: right; font-weight: bold; border-bottom: 2px solid #ddd;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #333;">
            <span>Total:</span>
            <span>${orderEmailData.totalAmount.toFixed(2)}€</span>
          </div>
        </div>

        <div style="background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="color: #2e7d32; margin: 0; font-weight: bold;">✅ Paiement reçu</p>
          <p style="color: #558b2f; margin: 10px 0 0 0;">Votre paiement a été traité avec succès.</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="color: #666; line-height: 1.6;">
            Vous recevrez bientôt un email de confirmation d'expédition avec le numéro de suivi de votre commande.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Si vous avez des questions, n'hésitez pas à nous contacter.
          </p>
        </div>

        <div style="border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px;">
          <p>Snipersmarket - © 2026 Tous droits réservés</p>
          <p>Cet email a été envoyé à ${orderEmailData.userEmail}</p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: orderEmailData.userEmail,
      subject: `Confirmation de votre commande #${orderEmailData.orderId}`,
      html,
      text: `Confirmation de commande #${orderEmailData.orderId}\n\nBonjour ${orderEmailData.customerName},\n\nVotre commande a été reçue et payée avec succès.\n\nTotal: ${orderEmailData.totalAmount.toFixed(2)}€\n\nMerci pour votre achat!`
    });
  }

  /**
   * Envoie un email d'alerte admin
   */
  async sendAdminAlert(orderEmailData: {
    orderId: string;
    userEmail: string;
    userName: string;
    items: Array<{name: string; quantity: number; price: number}>;
    totalAmount: number;
  }): Promise<{success: boolean; messageId?: string; error?: string}> {
    const itemsList = orderEmailData.items
      .map((item) => `- ${item.name} x${item.quantity} = ${(item.quantity * item.price).toFixed(2)}€`)
      .join("\n");

    const text = `
Nouvelle commande reçue!

Commande #${orderEmailData.orderId}
Client: ${orderEmailData.userName} (${orderEmailData.userEmail})
Montant: ${orderEmailData.totalAmount.toFixed(2)}€

Produits:
${itemsList}

À traiter au plus vite.
    `;

    return this.sendEmail({
      to: process.env.ADMIN_EMAIL || this.fromEmail,
      subject: `[ADMIN] Nouvelle commande #${orderEmailData.orderId}`,
      html: `<pre>${text}</pre>`,
      text
    });
  }

  /**
   * Envoie un email de confirmation d'expédition avec numéro de suivi
   */
  async sendShippingConfirmationEmail(data: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    trackingNumber: string;
    estimatedDeliveryDate: string; // Format: "DD/MM/YYYY" ou "lundi 20 janvier 2026"
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    totalAmount: number;
    currency: string;
  }): Promise<{success: boolean; messageId?: string; error?: string}> {
    const itemsList = data.items
      .map(
        (item) =>
          `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}${data.currency === "eur" ? "€" : data.currency.toUpperCase()}</td>
      </tr>
    `
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">📦 Commande expédiée !</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Bonjour ${data.customerName},</p>
          
          <p>Excellente nouvelle ! Votre commande a été expédiée et sera bientôt entre vos mains.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h2 style="margin-top: 0; color: #059669;">Informations de livraison</h2>
            <p><strong>Numéro de commande :</strong> #${data.orderId}</p>
            <p style="margin: 10px 0;"><strong>Numéro de suivi :</strong> <span style="background: #f0fdf4; padding: 5px 10px; border-radius: 4px; font-family: monospace; font-weight: bold; color: #059669;">${data.trackingNumber}</span></p>
            <p><strong>Date de livraison estimée :</strong> ${data.estimatedDeliveryDate}</p>
          </div>
          
          <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #0c4a6e;">
              <strong>💡 Suivez votre colis :</strong> Vous pouvez utiliser le numéro de suivi ci-dessus pour suivre l'acheminement de votre commande sur le site du transporteur.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #059669;">Récapitulatif de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produit</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantité</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Total :</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #059669; border-top: 2px solid #ddd;">${data.totalAmount.toFixed(2)}${data.currency === "eur" ? "€" : data.currency.toUpperCase()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p style="margin-top: 20px;">Votre commande devrait être livrée le <strong>${data.estimatedDeliveryDate}</strong>.</p>
          
          <p style="margin-top: 20px;">Merci pour votre confiance !</p>
          
          <div style="border-top: 1px solid #ddd; padding-top: 20px; color: #999; font-size: 12px; margin-top: 30px;">
            <p>Snipersmarket - © 2026 Tous droits réservés</p>
            <p>Cet email a été envoyé à ${data.customerEmail}</p>
          </div>
        </div>
      </div>
    `;

    const text = `
📦 Confirmation d'expédition

Bonjour ${data.customerName},

Excellente nouvelle ! Votre commande a été expédiée et sera bientôt entre vos mains.

Informations de livraison :
- Numéro de commande : #${data.orderId}
- Numéro de suivi : ${data.trackingNumber}
- Date de livraison estimée : ${data.estimatedDeliveryDate}

💡 Suivez votre colis : Vous pouvez utiliser le numéro de suivi ci-dessus pour suivre l'acheminement de votre commande sur le site du transporteur.

Votre commande devrait être livrée le ${data.estimatedDeliveryDate}.

Merci pour votre confiance !

Cordialement,
L'équipe SnipersMarket
    `;

    return this.sendEmail({
      to: data.customerEmail,
      subject: `📦 Votre commande #${data.orderId} a été expédiée`,
      html,
      text
    });
  }

  /**
   * Envoie un rappel de panier abandonné
   */
  async sendCartAbandonmentReminder(email: string, cartData: {
    items: Array<{name: string; quantity: number; price: number}>;
    total: number;
  }): Promise<{success: boolean; messageId?: string; error?: string}> {
    const itemsList = cartData.items
      .map((item) => `- ${item.name} x${item.quantity} = ${(item.quantity * item.price).toFixed(2)}€`)
      .join("\n");

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Vous avez oublié quelque chose? 🛒</h2>
        <p>Votre panier contient ${cartData.items.length} article(s) pour un total de ${cartData.total.toFixed(2)}€</p>
        <pre>${itemsList}</pre>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/cart" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Continuer votre achat</a></p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Vous avez laissé des articles dans votre panier",
      html,
      text: `Bonjour,\n\nVous avez oublié des articles dans votre panier:\n${itemsList}\n\nTotal: ${cartData.total.toFixed(2)}€\n\nContinuez votre achat: ${process.env.NEXT_PUBLIC_APP_URL}/cart`
    });
  }
}

export default SendgridEmailService;
