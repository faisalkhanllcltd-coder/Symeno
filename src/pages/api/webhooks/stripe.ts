import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { logger } from '../../../lib/logger';
import Stripe from 'stripe';

export const POST: APIRoute = async ({ request }) => {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      logger.warn('Webhook rejected: Missing stripe-signature header.');
      return new Response('Unauthorized: No signature', { status: 401 });
    }

    const payload = await request.text();
    const stripeSecret = (env as any).STRIPE_SECRET_KEY;
    const webhookSecret = (env as any).STRIPE_WEBHOOK_SECRET;

    if (!stripeSecret || !webhookSecret) {
      logger.error('Webhook execution failed: Missing environment variables.');
      return new Response('Internal Server Error', { status: 500 });
    }

    const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });
    let event: Stripe.Event;

    try {
      // STRICT SECURITY: Cryptographically validates the webhook origin and payload on the Edge
      event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error('Webhook Signature Verification Failed', err);
      }
      return new Response(`Unauthorized: Invalid signature`, { status: 401 });
    }

    logger.info(`Received Verified Stripe Webhook: ${event.type}`);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logger.info(`Payment secured for intent: ${paymentIntent.id}`);
      // Dispatch database state updates or fulfillment triggers here
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error('Webhook Execution Error', err);
    }
    return new Response(`Internal Server Error`, { status: 500 });
  }
};