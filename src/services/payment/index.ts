/** @format */

/**
 * Point d'entrée pour le système de paiement
 * Exporte tous les éléments nécessaires pour utiliser le système
 * 
 * NOTE: Pour les composants côté client, importez directement depuis les fichiers
 * pour éviter d'importer des dépendances serveur (comme nodemailer)
 */

// Services utilisables côté client
export { OrderService } from "./order/OrderService";
export { PaymentValidationService } from "./validation/PaymentValidationService";
export { StripePaymentService } from "./providers/StripePaymentService";

// Services serveur uniquement (utilisés dans les API routes)
// Ne pas importer dans les composants client
export { PaymentFactory } from "./PaymentFactory";
export { PaymentManager } from "./PaymentManager";

// Interfaces
export type { IPaymentService } from "./interfaces/IPaymentService";
export type { IOrderService } from "./interfaces/IOrderService";
export type { IValidationService } from "./interfaces/IValidationService";

