/** @format */

/**
 * Interface pour le service de commande
 * Respect du principe : Interface Segregation Principle (ISP)
 * Interface spécifique pour la gestion des commandes
 */

import { OrderData, PaymentStatus } from "@/types/payment.types";

export interface IOrderService {
  /**
   * Crée une nouvelle commande
   * @param orderData - Données de la commande
   * @returns ID de la commande créée
   */
  createOrder(orderData: Omit<OrderData, "id" | "createdAt" | "updatedAt">): Promise<string>;

  /**
   * Met à jour le statut d'une commande
   * @param orderId - ID de la commande
   * @param status - Nouveau statut
   * @returns Succès de la mise à jour
   */
  updateOrderStatus(orderId: string, status: PaymentStatus): Promise<boolean>;

  /**
   * Récupère une commande par son ID
   * @param orderId - ID de la commande
   * @returns Données de la commande ou null
   */
  getOrderById(orderId: string): Promise<OrderData | null>;

  /**
   * Récupère les commandes d'un utilisateur
   * @param userId - ID de l'utilisateur
   * @returns Liste des commandes
   */
  getOrdersByUserId(userId: string): Promise<OrderData[]>;

  /**
   * Met à jour une commande avec l'ID de session Stripe
   * @param orderId - ID de la commande
   * @param stripeSessionId - ID de la session Stripe
   * @returns Succès de la mise à jour
   */
  updateOrderWithStripeSession(
    orderId: string,
    stripeSessionId: string
  ): Promise<boolean>;
}

