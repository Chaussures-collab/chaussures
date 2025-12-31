/** @format */

/**
 * Interface pour le service de validation
 * Respect du principe : Single Responsibility Principle (SRP)
 * Responsabilité unique : valider les données
 */

import { PaymentItem, CreatePaymentSessionRequest } from "@/types/payment.types";

export interface IValidationService {
  /**
   * Valide les items du panier
   * @param items - Items à valider
   * @returns true si valide, sinon lance une erreur
   */
  validateItems(items: PaymentItem[]): boolean;

  /**
   * Valide une requête de création de session de paiement
   * @param request - Requête à valider
   * @returns true si valide, sinon lance une erreur
   */
  validatePaymentRequest(request: CreatePaymentSessionRequest): boolean;

  /**
   * Valide un montant
   * @param amount - Montant à valider
   * @returns true si valide, sinon lance une erreur
   */
  validateAmount(amount: number): boolean;
}

