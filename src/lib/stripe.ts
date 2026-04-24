// src/lib/stripe.ts
import Stripe from 'stripe';
import { env } from 'cloudflare:workers';

// Exported function to ensure we capture the Cloudflare runtime bindings securely
// per-request instead of at static file load.
export const getStripeClient = (): Stripe => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error(
      'FATAL: STRIPE_SECRET_KEY is missing in environment variables.'
    );
  }

  return new Stripe(env.STRIPE_SECRET_KEY, {
    // @ts-ignore - Bypassing strict version literal check to ensure stable SDK compatibility
    apiVersion: '2023-10-16',
    appInfo: {
      name: 'Symeno Storefront',
      version: '1.0.0',
    },
    // CRITICAL: Forces Stripe to use standard Web Fetch API instead of Node.js HTTP modules
    httpClient: Stripe.createFetchHttpClient(),
  });
};

// Edge-safe Webhook validation using Web Crypto API instead of Node Buffer/Crypto
export const verifyStripeWebhook = async (
  payload: string,
  signature: string
): Promise<Stripe.Event> => {
  const secret = env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      'FATAL: STRIPE_WEBHOOK_SECRET is missing. Cannot process webhooks safely.'
    );
  }

  const stripe = getStripeClient();

  // constructEventAsync operates natively on the Edge using Web Crypto
  return await stripe.webhooks.constructEventAsync(payload, signature, secret);
};
