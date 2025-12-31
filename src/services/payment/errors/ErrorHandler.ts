/* eslint-disable @typescript-eslint/no-explicit-any */
/** @format */

/**
 * Gestionnaire d'erreurs centralisé
 * Fournit des méthodes pour gérer et formater les erreurs de manière cohérente
 */

import {
  PaymentError,
  ValidationError,
  PaymentServiceError,
  OrderError,
  WebhookError/* ,
  AuthenticationError,
  NotFoundError */
} from "./PaymentError";

interface ErrorInfo {
  timestamp: string;
  name: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;

  // Champs PaymentError
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export class ErrorHandler {
  /**
   * Log une erreur de manière structurée
   */
  static logError(
    error: Error | PaymentError,
    context?: Record<string, unknown>
  ): ErrorInfo {
    const errorInfo: ErrorInfo = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    };

    if (error instanceof PaymentError) {
      errorInfo.code = error.code;
      errorInfo.statusCode = error.statusCode;
      errorInfo.details = error.details;
    }

    if (process.env.NODE_ENV === "production") {
      console.error(JSON.stringify(errorInfo));
    } else {
      console.error("❌ Erreur:", errorInfo);
    }

    return errorInfo;
  }

  /**
   * Formate une erreur pour la réponse API
   */
  static formatErrorForResponse(error: Error | PaymentError): {
    error: string;
    code?: string;
    statusCode: number;
    details?: Record<string, unknown>;
  } {
    if (error instanceof PaymentError) {
      return {
        error: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      };
    }

    // Erreur générique non gérée
    return {
      error:
        process.env.NODE_ENV === "production"
          ? "Une erreur interne s'est produite"
          : error.message,
      statusCode: 500
    };
  }

  /**
   * Gère une erreur et retourne une réponse formatée
   */
  static handleError(
    error: unknown,
    context?: Record<string, unknown>
  ): {
    error: string;
    code?: string;
    statusCode: number;
    details?: Record<string, unknown>;
  } {
    let handledError: Error | PaymentError;

    if (error instanceof PaymentError) {
      handledError = error;
    } else if (error instanceof Error) {
      // Convertit une erreur générique en PaymentError
      handledError = new PaymentError(error.message, "UNKNOWN_ERROR", 500);
    } else {
      // Erreur inconnue
      handledError = new PaymentError(
        "Une erreur inconnue s'est produite",
        "UNKNOWN_ERROR",
        500
      );
    }

    // Log l'erreur
    this.logError(handledError, context);

    // Retourne la réponse formatée
    return this.formatErrorForResponse(handledError);
  }

  /**
   * Crée une erreur de validation avec des détails de champ
   */
  static createValidationError(
    message: string,
    fieldErrors?: Record<string, string>
  ): ValidationError {
    return new ValidationError(message, { fieldErrors });
  }

  /**
   * Crée une erreur de service de paiement
   */
  static createPaymentServiceError(
    message: string,
    serviceCode?: string,
    details?: Record<string, any>
  ): PaymentServiceError {
    return new PaymentServiceError(message, serviceCode, 502, details);
  }

  /**
   * Crée une erreur de commande
   */
  static createOrderError(
    message: string,
    orderId?: string,
    details?: Record<string, any>
  ): OrderError {
    return new OrderError(message, "ORDER_ERROR", 500, {
      orderId,
      ...details
    });
  }

  /**
   * Crée une erreur de webhook
   */
  static createWebhookError(
    message: string,
    eventType?: string,
    details?: Record<string, any>
  ): WebhookError {
    return new WebhookError(message, "WEBHOOK_ERROR", 400, {
      eventType,
      ...details
    });
  }
}

