import Stripe from "stripe";

// Server-side Stripe instance
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion,
      typescript: true,
    });
  }
  return stripeInstance;
}

// Price IDs — set in .env
export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  annual: process.env.STRIPE_PRICE_ANNUAL || "",
};

export const PLAN_FEATURES = {
  FREE: {
    name: "Free",
    price: "$0",
    messagesPerDay: 3,
    features: [
      "Daily quote",
      "3 AI messages/day",
      "Basic sign profile",
      "Partial daily readings",
    ],
  },
  PREMIUM: {
    name: "Pro",
    price: "$9.99/mo",
    annualPrice: "$79.99/yr",
    messagesPerDay: 50,
    features: [
      "Everything in Free",
      "50 AI messages/day",
      "Full daily readings & insights",
      "Regenerate readings",
      "Full sign profile (25+ sections)",
      "Compatibility checker",
      "Birth chart analysis",
      "Transit alerts",
      "Weekly & monthly readings",
      "Tarot card of the day",
      "Journal & mood tracker",
      "Reading history",
      "Priority AI responses",
    ],
  },
};
