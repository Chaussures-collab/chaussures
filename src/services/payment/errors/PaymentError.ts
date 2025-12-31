/** @format */

/**
 * Classes d'erreur personnalisées pour le système de paiement
 * Permet une gestion d'erreurs cohérente et typée
 */

/**
 * Erreur de base pour le système de paiement
 */
export class PaymentError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = "PAYMENT_ERROR",
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    // Maintient la stack trace pour le debugging
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details
    };
  }
}

/**
 * Erreur de validation
 */
export class ValidationError extends PaymentError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

/**
 * Erreur de service de paiement (Stripe, etc.)
 */
export class PaymentServiceError extends PaymentError {
  constructor(
    message: string,
    code: string = "PAYMENT_SERVICE_ERROR",
    statusCode: number = 502,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }
}

/**
 * Erreur de commande
 */
export class OrderError extends PaymentError {
  constructor(
    message: string,
    code: string = "ORDER_ERROR",
    statusCode: number = 500,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }
}

/**
 * Erreur de webhook
 */
export class WebhookError extends PaymentError {
  constructor(
    message: string,
    code: string = "WEBHOOK_ERROR",
    statusCode: number = 400,
    details?: Record<string, unknown>
  ) {
    super(message, code, statusCode, details);
  }
}

/**
 * Erreur d'authentification/autorisation
 */
export class AuthenticationError extends PaymentError {
  constructor(message: string = "Authentification requise", details?: Record<string, unknown>) {
    super(message, "AUTHENTICATION_ERROR", 401, details);
  }
}

/**
 * Erreur de ressource non trouvée
 */
export class NotFoundError extends PaymentError {
  constructor(message: string = "Ressource non trouvée", details?: Record<string, unknown>) {
    super(message, "NOT_FOUND_ERROR", 404, details);
  }
}

