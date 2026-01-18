/** @format */

/**
 * Types et interfaces pour le système de paiement
 * Respect des principes SOLID : Interface Segregation Principle (ISP)
 */

// Types de base
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED" | "SHIPPED" | "DELIVERED";

export type PaymentMethod = "STRIPE" | "PAYPAL" | "BANK_TRANSFER";

// Item du panier pour le paiement
export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

// Données de commande
export interface OrderData {
  id: string;
  userId: string;
  userEmail: string;
  items: PaymentItem[];
  totalAmount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, string>;
  // Champs d'expédition
  trackingNumber?: string;
  shippedAt?: Date;
  estimatedDeliveryDate?: Date;
  shippingEmailSent?: boolean;
  shippingEmailSentAt?: Date;
}

// Résultat d'une création de session de paiement
export interface PaymentSessionResult {
  success: boolean;
  sessionId?: string;
  url?: string;
  error?: string;
}

// Résultat d'un traitement de paiement
export interface PaymentProcessResult {
  success: boolean;
  orderId?: string;
  error?: string;
  message?: string;
}

// Données pour créer une session de paiement
export interface CreatePaymentSessionRequest {
  items: PaymentItem[];
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

// Données du webhook Stripe
export interface StripeWebhookData {
  sessionId: string;
  customerEmail?: string | null;
  amountTotal: number | null;
  currency: string | null;
  paymentStatus: PaymentStatus;
  metadata?: Record<string, string>;
}

