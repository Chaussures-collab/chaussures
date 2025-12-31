/** @format */

/**
 * Factory pour créer une instance du PaymentManager
 * Respect du principe : Dependency Inversion Principle (DIP)
 * Centralise la création des dépendances
 */

import { PaymentManager } from "./PaymentManager";
import { StripePaymentService } from "./providers/StripePaymentService";
import { OrderService } from "./order/OrderService";
import { PaymentValidationService } from "./validation/PaymentValidationService";

export class PaymentFactory {
  /**
   * Crée une instance complète du PaymentManager avec toutes ses dépendances
   */
  static createPaymentManager(): PaymentManager {
    const paymentService = new StripePaymentService();
    const orderService = new OrderService();
    const validationService = new PaymentValidationService();

    return new PaymentManager(paymentService, orderService, validationService);
  }
}

