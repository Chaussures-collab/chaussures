/** @format */

/**
 * Interface pour le service de paiement
 * Respect du principe : Dependency Inversion Principle (DIP)
 * Le code dépend d'abstractions, pas d'implémentations concrètes
 */

import {
  CreatePaymentSessionRequest,
  PaymentSessionResult,
  PaymentProcessResult
} from "@/types/payment.types";

export interface IPaymentService {
  /**
   * Crée une session de paiement
   * @param request - Données de la session de paiement
   * @returns Résultat de la création de session
   */
  createPaymentSession(
    request: CreatePaymentSessionRequest
  ): Promise<PaymentSessionResult>;

  /**
   * Traite un paiement validé (via webhook)
   * @param sessionId - ID de la session Stripe
   * @param webhookData - Données du webhook
   * @returns Résultat du traitement
   */
  processPayment(
    sessionId: string,
    webhookData?: unknown
  ): Promise<PaymentProcessResult>;

  /**
   * Vérifie le statut d'un paiement
   * @param sessionId - ID de la session
   * @returns Statut du paiement
   */
  verifyPaymentStatus(sessionId: string): Promise<PaymentProcessResult>;
}

