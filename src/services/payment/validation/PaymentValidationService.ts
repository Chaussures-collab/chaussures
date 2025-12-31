/** @format */

/**
 * Service de validation des données de paiement
 * Respect du principe : Single Responsibility Principle (SRP)
 * Responsabilité unique : valider les données de paiement
 */

import { IValidationService } from "../interfaces/IValidationService";
import {
  PaymentItem,
  CreatePaymentSessionRequest
} from "@/types/payment.types";
import { ValidationError } from "../errors/PaymentError";

export class PaymentValidationService implements IValidationService {
  private readonly MIN_AMOUNT = 0.01;
  private readonly MAX_AMOUNT = 1000000;
  private readonly MIN_QUANTITY = 1;
  private readonly MAX_QUANTITY = 1000;

  validateItems(items: PaymentItem[]): boolean {
    if (!items || items.length === 0) {
      throw new ValidationError("Le panier ne peut pas être vide", {
        field: "items",
        reason: "EMPTY_CART"
      });
    }

    const fieldErrors: Record<string, string> = {};

    items.forEach((item, index) => {
      if (!item.id || typeof item.id !== "string") {
        fieldErrors[`items[${index}].id`] = "L'ID de l'item est requis et doit être une chaîne";
      }

      if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
        fieldErrors[`items[${index}].name`] = "Le nom de l'item est requis";
      }

      try {
        this.validateAmount(item.price);
      } catch (error) {
        if (error instanceof ValidationError) {
          fieldErrors[`items[${index}].price`] = error.message;
        }
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < this.MIN_QUANTITY ||
        item.quantity > this.MAX_QUANTITY
      ) {
        fieldErrors[`items[${index}].quantity`] = `La quantité doit être un entier entre ${this.MIN_QUANTITY} et ${this.MAX_QUANTITY}`;
      }
    });

    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidationError("Erreurs de validation dans les items du panier", {
        fieldErrors
      });
    }

    return true;
  }

  validatePaymentRequest(request: CreatePaymentSessionRequest): boolean {
    if (!request) {
      throw new ValidationError("La requête de paiement est requise", {
        field: "request",
        reason: "MISSING_REQUEST"
      });
    }

    const fieldErrors: Record<string, string> = {};

    // Validation des items
    try {
      this.validateItems(request.items);
    } catch (error) {
      if (error instanceof ValidationError && error.details?.fieldErrors) {
        Object.assign(fieldErrors, error.details.fieldErrors);
      }
    }

    // Validation de l'ID utilisateur
    if (!request.userId || typeof request.userId !== "string") {
      fieldErrors.userId = "L'ID utilisateur est requis";
    }

    // Validation de l'email
    if (!request.userEmail || typeof request.userEmail !== "string") {
      fieldErrors.userEmail = "L'email utilisateur est requis";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(request.userEmail)) {
        fieldErrors.userEmail = "L'email utilisateur n'est pas valide";
      }
    }

    // Validation des URLs
    if (!request.successUrl || typeof request.successUrl !== "string") {
      fieldErrors.successUrl = "L'URL de succès est requise";
    } else {
      try {
        new URL(request.successUrl);
      } catch {
        fieldErrors.successUrl = "L'URL de succès n'est pas valide";
      }
    }

    if (!request.cancelUrl || typeof request.cancelUrl !== "string") {
      fieldErrors.cancelUrl = "L'URL d'annulation est requise";
    } else {
      try {
        new URL(request.cancelUrl);
      } catch {
        fieldErrors.cancelUrl = "L'URL d'annulation n'est pas valide";
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidationError("Erreurs de validation dans la requête de paiement", {
        fieldErrors
      });
    }

    return true;
  }

  validateAmount(amount: number): boolean {
    if (typeof amount !== "number" || isNaN(amount)) {
      throw new ValidationError("Le montant doit être un nombre valide", {
        field: "amount",
        value: amount,
        reason: "INVALID_TYPE"
      });
    }

    if (amount < this.MIN_AMOUNT) {
      throw new ValidationError(`Le montant minimum est ${this.MIN_AMOUNT}€`, {
        field: "amount",
        value: amount,
        min: this.MIN_AMOUNT,
        reason: "BELOW_MINIMUM"
      });
    }

    if (amount > this.MAX_AMOUNT) {
      throw new ValidationError(`Le montant maximum est ${this.MAX_AMOUNT}€`, {
        field: "amount",
        value: amount,
        max: this.MAX_AMOUNT,
        reason: "ABOVE_MAXIMUM"
      });
    }

    return true;
  }
}

