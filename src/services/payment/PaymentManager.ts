/** @format */

/**
 * Gestionnaire de paiement - Orchestrateur principal
 * Respect du principe : Single Responsibility Principle (SRP)
 * Responsabilité unique : orchestrer les différents services de paiement
 * Respect du principe : Dependency Inversion Principle (DIP)
 * Dépend d'interfaces, pas d'implémentations concrètes
 */

import { IPaymentService } from "./interfaces/IPaymentService";
import { IOrderService } from "./interfaces/IOrderService";
import { IValidationService } from "./interfaces/IValidationService";
import {
  CreatePaymentSessionRequest,
  PaymentSessionResult,
  PaymentProcessResult,
  StripeWebhookData,
  PaymentItem
} from "@/types/payment.types";
import { PaymentError } from "./errors/PaymentError";
import { ErrorHandler } from "./errors/ErrorHandler";
// Import dynamique pour éviter l'import côté client (nodemailer nécessite child_process)
type EmailServiceType = typeof import("../email/EmailService");
let emailService: EmailServiceType["emailService"] | null = null;

// Fonction pour charger EmailService uniquement côté serveur
async function getEmailService() {
  if (globalThis.window === undefined && !emailService) {
    const emailModule = await import("../email/EmailService");
    emailService = emailModule.emailService;
  }
  return emailService;
}

export class PaymentManager {
  constructor(
    private readonly paymentService: IPaymentService,
    private readonly orderService: IOrderService,
    private readonly validationService: IValidationService
  ) {}

  /**
   * Crée une session de paiement
   * La commande sera créée uniquement après le paiement réussi (via webhook)
   */
  async initiatePayment(
    request: CreatePaymentSessionRequest
  ): Promise<PaymentSessionResult> {
    try {
      // Validation des données
      this.validationService.validatePaymentRequest(request);

      // Calcul du total
      const totalAmount = request.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Création de la session de paiement avec les métadonnées nécessaires
      // On stocke les données de commande dans les métadonnées Stripe
      // La commande sera créée uniquement après le paiement réussi via webhook
      const sessionResult = await this.paymentService.createPaymentSession({
        ...request,
        metadata: {
          ...request.metadata,
          userId: request.userId,
          userEmail: request.userEmail,
          totalAmount: totalAmount.toString(),
          itemsCount: request.items.length.toString()
        }
      });

      if (!sessionResult.success) {
        return sessionResult;
      }

      return sessionResult;
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "initiatePayment", userId: request.userId }
      );

      // Si c'est déjà une PaymentError, on la propage
      if (error instanceof PaymentError) {
        throw error;
      }

      // Sinon, on crée une erreur générique
      throw new PaymentError(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'initiation du paiement",
        "PAYMENT_INITIATION_ERROR",
        500,
        { userId: request.userId }
      );
    }
  }

  /**
   * Traite un paiement validé via webhook
   * Crée la commande uniquement après le paiement réussi
   */
  async handlePaymentWebhook(
    webhookData: StripeWebhookData
  ): Promise<PaymentProcessResult> {
    console.log(`🔵 [PaymentManager] handlePaymentWebhook appelé avec:`, {
      sessionId: webhookData.sessionId,
      paymentStatus: webhookData.paymentStatus,
      hasMetadata: !!webhookData.metadata,
      metadataKeys: webhookData.metadata
        ? Object.keys(webhookData.metadata)
        : []
    });

    try {
      // Si le paiement a réussi, on crée la commande
      // Note: On utilise directement le statut du webhook car le webhook est déjà déclenché uniquement si le paiement a réussi
      // On n'appelle plus processPayment pour éviter les erreurs inutiles avec les Payment Intents
      if (webhookData.paymentStatus === "PAID" && webhookData.metadata) {
        const userId = webhookData.metadata.userId;
        const userEmail =
          webhookData.metadata.userEmail || webhookData.customerEmail || "";
        const totalAmount = Number.parseFloat(
          webhookData.metadata.totalAmount || "0"
        );

        if (!userId) {
          console.error(
            "❌ ID utilisateur manquant dans les métadonnées:",
            webhookData.metadata
          );
          throw ErrorHandler.createWebhookError(
            "ID utilisateur manquant dans les métadonnées",
            webhookData.paymentStatus,
            { sessionId: webhookData.sessionId, metadata: webhookData.metadata }
          );
        }

        // Récupération des items depuis les métadonnées Stripe
        let items: PaymentItem[] = [];
        try {
          if (webhookData.metadata.itemsJson) {
            const parsedItems = JSON.parse(webhookData.metadata.itemsJson);
            // Validation et conversion en PaymentItem[]
            if (Array.isArray(parsedItems)) {
              items = parsedItems
                .map((item: unknown) => {
                  if (
                    typeof item === "object" &&
                    item !== null &&
                    "id" in item &&
                    "name" in item &&
                    "price" in item &&
                    "quantity" in item
                  ) {
                    return {
                      id: String(item.id),
                      name: String(item.name),
                      price: Number(item.price),
                      quantity: Number(item.quantity),
                      description:
                        "description" in item
                          ? String(item.description)
                          : undefined,
                      imageUrl:
                        "imageUrl" in item ? String(item.imageUrl) : undefined
                    } as PaymentItem;
                  }
                  return null;
                })
                .filter((item): item is PaymentItem => item !== null);
            }
          }
        } catch (error) {
          console.error("❌ Erreur lors du parsing des items:", error);
          ErrorHandler.logError(
            error instanceof Error ? error : new Error("Erreur parsing items"),
            {
              operation: "parseItemsFromMetadata",
              sessionId: webhookData.sessionId,
              metadata: webhookData.metadata
            }
          );
          // On continue même si on ne peut pas parser les items, mais on log l'erreur
        }

        if (items.length === 0) {
          console.error(
            "❌ Aucun item trouvé dans les métadonnées. Metadata:",
            webhookData.metadata
          );
          throw ErrorHandler.createWebhookError(
            "Aucun item trouvé dans les métadonnées du paiement",
            webhookData.paymentStatus,
            { sessionId: webhookData.sessionId, metadata: webhookData.metadata }
          );
        }

        console.log(
          `📦 Création de la commande avec ${items.length} item(s) pour l'utilisateur ${userId}`
        );

        // Création de la commande avec le statut PAID (utilise Admin SDK pour contourner les règles Firestore)
        let orderId: string;
        try {
          console.log(
            `📝 [PaymentManager] Tentative de création de commande...`
          );
          console.log(`📝 [PaymentManager] Données de commande:`, {
            userId,
            userEmail,
            itemsCount: items.length,
            totalAmount: webhookData.amountTotal
              ? webhookData.amountTotal / 100
              : totalAmount,
            currency: webhookData.currency || "eur"
          });

          // Utiliser AdminOrderService au lieu de OrderService pour contourner les règles Firestore
          const { AdminOrderService } = await import(
            "../dashboard/AdminOrderService"
          );
          const adminOrderService = new AdminOrderService();

          orderId = await adminOrderService.createOrder({
            userId,
            userEmail,
            items,
            totalAmount: webhookData.amountTotal
              ? webhookData.amountTotal / 100
              : totalAmount, // Conversion des centimes
            currency: webhookData.currency || "eur",
            status: "PAID",
            paymentMethod: "STRIPE",
            stripeSessionId: webhookData.sessionId,
            metadata: webhookData.metadata
          });
          console.log(
            `✅ [PaymentManager] Commande créée avec succès: ${orderId}`
          );
        } catch (orderError) {
          console.error(
            "❌ [PaymentManager] Erreur lors de la création de la commande:",
            orderError
          );
          console.error(
            "❌ [PaymentManager] Stack trace:",
            orderError instanceof Error
              ? orderError.stack
              : "Pas de stack trace"
          );
          ErrorHandler.logError(
            orderError instanceof Error
              ? orderError
              : new Error("Erreur création commande"),
            { operation: "createOrder", userId, itemsCount: items.length }
          );
          throw orderError;
        }

        // Mise à jour du stock des produits (utilise Admin SDK)
        try {
          console.log(`🔵 [PaymentManager] DÉBUT - Mise à jour du stock...`);
          if (items.length > 0) {
            console.log(
              `📝 [PaymentManager] Chargement AdminProductService...`
            );
            const { AdminProductService } = await import(
              "../dashboard/AdminProductService"
            );
            console.log(`✅ [PaymentManager] AdminProductService chargé`);

            const adminProductService = new AdminProductService();
            console.log(`✅ [PaymentManager] AdminProductService instancié`);

            const stockUpdates = items.map((item) => ({
              productId: item.id,
              quantity: item.quantity
            }));
            console.log(`📝 [PaymentManager] Stock updates:`, stockUpdates);

            console.log(`🔵 [PaymentManager] Appel decrementStocks...`);
            await adminProductService.decrementStocks(stockUpdates);
            console.log(
              `✅ [PaymentManager] Stock mis à jour pour ${items.length} produit(s) de la commande ${orderId}`
            );
          } else {
            console.warn(
              "⚠️ [PaymentManager] Aucun item à mettre à jour pour le stock"
            );
          }
        } catch (stockError) {
          console.error(
            "❌ [PaymentManager] ERREUR STOCK - Type:",
            stockError instanceof Error
              ? stockError.constructor.name
              : typeof stockError
          );
          console.error(
            "❌ [PaymentManager] ERREUR STOCK - Message:",
            stockError instanceof Error
              ? stockError.message
              : String(stockError)
          );
          console.error(
            "❌ [PaymentManager] ERREUR STOCK - Stack:",
            stockError instanceof Error ? stockError.stack : "N/A"
          );
          ErrorHandler.logError(
            stockError instanceof Error
              ? stockError
              : new Error("Erreur mise à jour stock"),
            { operation: "decrementStocks", orderId, items }
          );
        }

        // Marquer les paniers abandonnés comme récupérés (utilise Admin SDK)
        try {
          console.log(
            `🔵 [PaymentManager] DÉBUT - Marquage paniers abandonnés...`
          );
          console.log(
            `📝 [PaymentManager] Chargement AdminAbandonedCartService...`
          );
          const { AdminAbandonedCartService } = await import(
            "../cart/AdminAbandonedCartService"
          );
          console.log(`✅ [PaymentManager] AdminAbandonedCartService chargé`);

          const adminAbandonedCartService = new AdminAbandonedCartService();
          console.log(
            `✅ [PaymentManager] AdminAbandonedCartService instancié`
          );

          console.log(
            `🔵 [PaymentManager] Appel markUserCartsAsRecovered pour userId: ${userId}`
          );
          await adminAbandonedCartService.markUserCartsAsRecovered(userId);
          console.log(
            `✅ [PaymentManager] Panier(s) abandonné(s) marqué(s) comme récupéré(s) pour l'utilisateur ${userId}`
          );

          // Vider complètement le panier après paiement
          console.log(
            `🔵 [PaymentManager] DÉBUT - Suppression du panier utilisateur...`
          );
          await adminAbandonedCartService.clearUserCarts(userId);
          console.log(
            `✅ [PaymentManager] Panier utilisateur vidé pour l'utilisateur ${userId}`
          );
          console.log(
            `✅ [PaymentManager] Panier(s) abandonné(s) marqué(s) comme récupéré(s) pour l'utilisateur ${userId}`
          );
        } catch (cartError) {
          console.error(
            "❌ [PaymentManager] ERREUR PANIER - Type:",
            cartError instanceof Error
              ? cartError.constructor.name
              : typeof cartError
          );
          console.error(
            "❌ [PaymentManager] ERREUR PANIER - Message:",
            cartError instanceof Error ? cartError.message : String(cartError)
          );
          console.error(
            "❌ [PaymentManager] ERREUR PANIER - Stack:",
            cartError instanceof Error ? cartError.stack : "N/A"
          );
          ErrorHandler.logError(
            cartError instanceof Error
              ? cartError
              : new Error("Erreur mise à jour panier abandonné"),
            { operation: "markUserCartsAsRecovered", orderId, userId }
          );
        }

        // Envoi des emails de notification (client et admin)
        try {
          console.log(`🔵 [PaymentManager] DÉBUT - Envoi des emails...`);
          console.log(
            `📝 [PaymentManager] Données email: orderId=${orderId}, userEmail=${userEmail}, items=${items.length}`
          );

          await this.sendOrderEmails({
            orderId,
            userEmail,
            items,
            totalAmount: webhookData.amountTotal
              ? webhookData.amountTotal / 100
              : totalAmount,
            currency: webhookData.currency || "eur",
            paymentMethod: "STRIPE",
            metadata: webhookData.metadata
          });
          console.log(
            `✅ [PaymentManager] Emails de confirmation envoyés pour la commande ${orderId}`
          );
        } catch (emailError) {
          console.error(
            "❌ [PaymentManager] ERREUR EMAIL - Type:",
            emailError instanceof Error
              ? emailError.constructor.name
              : typeof emailError
          );
          console.error(
            "❌ [PaymentManager] ERREUR EMAIL - Message:",
            emailError instanceof Error
              ? emailError.message
              : String(emailError)
          );
          console.error(
            "❌ [PaymentManager] ERREUR EMAIL - Stack:",
            emailError instanceof Error ? emailError.stack : "N/A"
          );
          ErrorHandler.logError(
            emailError instanceof Error
              ? emailError
              : new Error("Erreur envoi email"),
            { operation: "sendOrderEmails", orderId, userEmail }
          );
        }

        return {
          success: true,
          orderId,
          message: "Paiement validé et commande créée",
          error: undefined
        };
      }

      // Si le paiement n'a pas réussi (statut différent de PAID ou métadonnées manquantes)
      console.warn(`⚠️ [PaymentManager] Paiement non traité:`, {
        paymentStatus: webhookData.paymentStatus,
        hasMetadata: !!webhookData.metadata
      });
      return {
        success: false,
        message:
          "Paiement non traité (statut non PAID ou métadonnées manquantes)",
        error: `Statut: ${webhookData.paymentStatus}, Métadonnées: ${
          webhookData.metadata ? "présentes" : "manquantes"
        }`
      };
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "handlePaymentWebhook", webhookData }
      );

      // Si c'est déjà une PaymentError, on la propage
      if (error instanceof PaymentError) {
        throw error;
      }

      // Sinon, on crée une erreur de webhook
      throw ErrorHandler.createWebhookError(
        error instanceof Error
          ? error.message
          : "Erreur lors du traitement du webhook",
        webhookData.paymentStatus,
        {
          sessionId: webhookData.sessionId,
          originalError: error instanceof Error ? error.message : String(error)
        }
      );
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async checkPaymentStatus(sessionId: string): Promise<PaymentProcessResult> {
    try {
      return await this.paymentService.verifyPaymentStatus(sessionId);
    } catch (error) {
      ErrorHandler.logError(
        error instanceof Error ? error : new Error("Erreur inconnue"),
        { operation: "checkPaymentStatus", sessionId }
      );

      // Si c'est déjà une PaymentError, on la propage
      if (error instanceof PaymentError) {
        throw error;
      }

      // Sinon, on crée une erreur générique
      throw new PaymentError(
        error instanceof Error
          ? error.message
          : "Erreur lors de la vérification du statut",
        "PAYMENT_STATUS_CHECK_ERROR",
        500,
        { sessionId }
      );
    }
  }

  /**
   * Envoie les emails de notification après une commande
   * @private
   */
  private async sendOrderEmails(data: {
    orderId: string;
    userEmail: string;
    items: PaymentItem[];
    totalAmount: number;
    currency: string;
    paymentMethod: string;
    metadata?: Record<string, string>;
  }): Promise<void> {
    console.log(`📝 [sendOrderEmails] Début du traitement des emails`);

    // Récupérer le nom du client depuis les métadonnées ou utiliser l'email
    const customerName =
      data.metadata?.nom && data.metadata?.prenom
        ? `${data.metadata.prenom} ${data.metadata.nom}`
        : data.metadata?.prenom ||
          data.metadata?.nom ||
          data.userEmail.split("@")[0] ||
          "Client";

    console.log(`📝 [sendOrderEmails] Customer name: ${customerName}`);

    const orderEmailData = {
      orderId: data.orderId,
      customerName,
      customerEmail: data.userEmail,
      items: data.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: data.totalAmount,
      currency: data.currency,
      paymentMethod: data.paymentMethod,
      orderDate: new Date().toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    console.log(`📝 [sendOrderEmails] Obtention du service email...`);
    // Envoyer l'email de confirmation au client - uniquement côté serveur
    const emailServiceInstance = await getEmailService();
    console.log(
      `📝 [sendOrderEmails] emailServiceInstance:`,
      emailServiceInstance ? "OK" : "NULL"
    );

    if (emailServiceInstance) {
      try {
        console.log(
          `🔵 [sendOrderEmails] Envoi email de confirmation client à ${orderEmailData.customerEmail}`
        );
        await emailServiceInstance.sendOrderConfirmationEmail(orderEmailData);
        console.log(`✅ [sendOrderEmails] Email de confirmation client envoyé`);
      } catch (confirmError) {
        console.error(
          `❌ [sendOrderEmails] Erreur lors de l'envoi de l'email de confirmation:`,
          confirmError
        );
        throw confirmError;
      }

      try {
        console.log(`🔵 [sendOrderEmails] Envoi alerte admin`);
        await emailServiceInstance.sendAdminOrderAlert(orderEmailData);
        console.log(`✅ [sendOrderEmails] Alerte admin envoyée`);
      } catch (adminError) {
        console.error(
          `❌ [sendOrderEmails] Erreur lors de l'envoi de l'alerte admin:`,
          adminError
        );
        throw adminError;
      }
    } else {
      console.error(
        `❌ [sendOrderEmails] emailServiceInstance est NULL - aucun service email disponible`
      );
      throw new Error("Service email non initialisé");
    }
  }
}

