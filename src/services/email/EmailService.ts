/** @format */

/**
 * Service d'envoi d'emails avec Microsoft Graph API
 * Supporte également SMTP pour compatibilité
 */

import { Client } from "@microsoft/microsoft-graph-client";
import { ConfidentialClientApplication } from "@azure/msal-node";
import { ClientSecretCredential } from "@azure/identity";
// @ts-ignore - Types nodemailer
import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
  paymentMethod: string;
  orderDate: string;
}

class EmailService {
  private graphClient: Client | null = null;
  private smtpTransporter: any = null; // nodemailer.Transporter
  private useGraphAPI: boolean = false;
  private fromEmail: string;

  constructor() {
    this.fromEmail = process.env.MICROSOFT_FROM_EMAIL || process.env.ADMIN_EMAIL || "";

    // Vérifier si on utilise Microsoft Graph API
    if (
      process.env.MICROSOFT_CLIENT_ID &&
      process.env.MICROSOFT_CLIENT_SECRET &&
      process.env.MICROSOFT_TENANT_ID
    ) {
      this.initializeGraphClient();
    } else if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASSWORD
    ) {
      // Utiliser SMTP si Graph API n'est pas configuré
      this.initializeSMTP();
      this.useGraphAPI = false;
    } else {
      console.warn(
        "⚠️ Aucune configuration email trouvée. Les emails ne seront pas envoyés."
      );
    }
  }

  /**
   * Initialise le client Microsoft Graph API
   */
  private initializeGraphClient(): void {
    try {
      // Stocker les credentials pour utilisation ultérieure
      this.useGraphAPI = true;
      // Le client sera initialisé lors du premier envoi d'email
    } catch (error) {
      console.error("Erreur lors de l'initialisation de Microsoft Graph:", error);
    }
  }

  /**
   * Obtient un client Graph initialisé
   */
  private async getGraphClient(): Promise<Client> {
    if (this.graphClient) {
      return this.graphClient;
    }

    // Utiliser ClientSecretCredential pour l'authentification
    const credential = new ClientSecretCredential(
      process.env.MICROSOFT_TENANT_ID!,
      process.env.MICROSOFT_CLIENT_ID!,
      process.env.MICROSOFT_CLIENT_SECRET!
    );

    // Créer un middleware d'authentification personnalisé
    const authProvider = {
      getAccessToken: async () => {
        const tokenResponse = await credential.getToken("https://graph.microsoft.com/.default");
        return tokenResponse?.token || "";
      }
    };

    // Créer le client Graph avec l'authentification
    this.graphClient = Client.initWithMiddleware({
      authProvider: authProvider as unknown as any
    });

    return this.graphClient;
  }

  /**
   * Initialise le transporteur SMTP
   */
  private initializeSMTP(): void {
    try {
      this.smtpTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true", // true pour 465, false pour autres ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      });
    } catch (error) {
      console.error("Erreur lors de l'initialisation SMTP:", error);
    }
  }

  /**
   * Envoie un email via Microsoft Graph API
   */
  private async sendViaGraphAPI(options: EmailOptions): Promise<void> {
    const graphClient = await this.getGraphClient();

    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const message = {
      message: {
        subject: options.subject,
        body: {
          contentType: "HTML",
          content: options.html
        },
        toRecipients: recipients.map((email) => ({
          emailAddress: {
            address: email
          }
        }))
      },
      saveToSentItems: true
    };

    await graphClient
      .api(`/users/${this.fromEmail}/sendMail`)
      .post(message);
  }

  /**
   * Envoie un email via SMTP
   */
  private async sendViaSMTP(options: EmailOptions): Promise<void> {
    if (!this.smtpTransporter) {
      throw new Error("SMTP Transporter non initialisé");
    }

    const recipients = Array.isArray(options.to) ? options.to : [options.to];

    await this.smtpTransporter.sendMail({
      from: options.from || this.fromEmail,
      to: recipients.join(", "),
      subject: options.subject,
      html: options.html,
      text: options.text
    });
  }

  /**
   * Envoie un email (utilise Graph API ou SMTP selon la configuration)
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      if (this.useGraphAPI && this.graphClient) {
        await this.sendViaGraphAPI(options);
      } else if (this.smtpTransporter) {
        await this.sendViaSMTP(options);
      } else {
        throw new Error("Aucun service email configuré");
      }
      console.log(`✅ Email envoyé à ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      throw error;
    }
  }

  /**
   * Envoie un email de confirmation de commande au client
   */
  async sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
    const html = this.generateOrderConfirmationHTML(data);
    const text = this.generateOrderConfirmationText(data);

    await this.sendEmail({
      to: data.customerEmail,
      subject: `Confirmation de commande #${data.orderId}`,
      html,
      text
    });
  }

  /**
   * Envoie un email d'alerte à l'administrateur pour une nouvelle commande
   */
  async sendAdminOrderAlert(data: OrderEmailData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || this.fromEmail;
    
    if (!adminEmail) {
      console.warn("⚠️ ADMIN_EMAIL non configuré, l'alerte admin ne sera pas envoyée");
      return;
    }

    const html = this.generateAdminAlertHTML(data);
    const text = this.generateAdminAlertText(data);

    await this.sendEmail({
      to: adminEmail,
      subject: `🚨 Nouvelle commande #${data.orderId} - ${data.totalAmount} ${data.currency.toUpperCase()}`,
      html,
      text
    });
  }

  /**
   * Génère le HTML de confirmation de commande pour le client
   */
  private generateOrderConfirmationHTML(data: OrderEmailData): string {
    const itemsHTML = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} ${data.currency.toUpperCase()}</td>
      </tr>
    `
      )
      .join("");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">✅ Commande confirmée !</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">Bonjour ${data.customerName},</p>
    
    <p>Nous avons bien reçu votre commande et votre paiement a été validé.</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #667eea;">Détails de la commande</h2>
      <p><strong>Numéro de commande :</strong> #${data.orderId}</p>
      <p><strong>Date :</strong> ${data.orderDate}</p>
      <p><strong>Méthode de paiement :</strong> ${data.paymentMethod}</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #667eea;">Articles commandés</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produit</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantité</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Total :</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #667eea; border-top: 2px solid #ddd;">${data.totalAmount.toFixed(2)} ${data.currency.toUpperCase()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <p>Vous recevrez un email de suivi dès que votre commande sera expédiée.</p>
    
    <p style="margin-top: 30px;">Merci pour votre confiance !</p>
    
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Cordialement,<br>
      L'équipe ShopiMarket
    </p>
  </div>
</body>
</html>
    `;
  }

  /**
   * Génère le texte brut de confirmation de commande
   */
  private generateOrderConfirmationText(data: OrderEmailData): string {
    const itemsText = data.items
      .map((item) => `- ${item.name} (x${item.quantity}) : ${item.price.toFixed(2)} ${data.currency.toUpperCase()}`)
      .join("\n");

    return `
Confirmation de commande

Bonjour ${data.customerName},

Nous avons bien reçu votre commande et votre paiement a été validé.

Détails de la commande :
- Numéro de commande : #${data.orderId}
- Date : ${data.orderDate}
- Méthode de paiement : ${data.paymentMethod}

Articles commandés :
${itemsText}

Total : ${data.totalAmount.toFixed(2)} ${data.currency.toUpperCase()}

Vous recevrez un email de suivi dès que votre commande sera expédiée.

Merci pour votre confiance !

Cordialement,
L'équipe ShopiMarket
    `;
  }

  /**
   * Génère le HTML d'alerte admin
   */
  private generateAdminAlertHTML(data: OrderEmailData): string {
    const itemsHTML = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} ${data.currency.toUpperCase()}</td>
      </tr>
    `
      )
      .join("");

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle commande</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0;">🚨 Nouvelle commande reçue</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
      <p style="margin: 0; font-weight: bold; color: #856404;">Action requise : Traiter cette commande</p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="margin-top: 0; color: #f5576c;">Informations de la commande</h2>
      <p><strong>Numéro de commande :</strong> #${data.orderId}</p>
      <p><strong>Client :</strong> ${data.customerName}</p>
      <p><strong>Email :</strong> ${data.customerEmail}</p>
      <p><strong>Date :</strong> ${data.orderDate}</p>
      <p><strong>Méthode de paiement :</strong> ${data.paymentMethod}</p>
      <p><strong>Montant total :</strong> <span style="font-size: 20px; font-weight: bold; color: #f5576c;">${data.totalAmount.toFixed(2)} ${data.currency.toUpperCase()}</span></p>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #f5576c;">Articles commandés</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f5f5f5;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Produit</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Quantité</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #ddd;">Total :</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #f5576c; border-top: 2px solid #ddd;">${data.totalAmount.toFixed(2)} ${data.currency.toUpperCase()}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    
    <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin-top: 20px; border-radius: 4px;">
      <p style="margin: 0; color: #0c5460;">
        <strong>⚠️ Important :</strong> Cette commande nécessite votre attention. Veuillez la traiter dans les plus brefs délais.
      </p>
    </div>
  </div>
</body>
</html>
    `;
  }

  /**
   * Génère le texte brut d'alerte admin
   */
  private generateAdminAlertText(data: OrderEmailData): string {
    const itemsText = data.items
      .map((item) => `- ${item.name} (x${item.quantity}) : ${item.price.toFixed(2)} ${data.currency.toUpperCase()}`)
      .join("\n");

    return `
🚨 NOUVELLE COMMANDE REÇUE

Action requise : Traiter cette commande

Informations de la commande :
- Numéro de commande : #${data.orderId}
- Client : ${data.customerName}
- Email : ${data.customerEmail}
- Date : ${data.orderDate}
- Méthode de paiement : ${data.paymentMethod}
- Montant total : ${data.totalAmount.toFixed(2)} ${data.currency.toUpperCase()}

Articles commandés :
${itemsText}

⚠️ Important : Cette commande nécessite votre attention. Veuillez la traiter dans les plus brefs délais.
    `;
  }
}

// Export d'une instance singleton
export const emailService = new EmailService();

