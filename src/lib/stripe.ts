/** @format */

// /lib/stripe.ts
import Stripe from "stripe";

// Utilisation de la version par défaut de la bibliothèque Stripe
// Cela évite les problèmes de compatibilité avec les versions d'API
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
