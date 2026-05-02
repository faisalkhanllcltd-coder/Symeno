import type { APIRoute } from 'astro';
import { cacheCartState } from '../../lib/kv';
import { logger } from '../../lib/logger';
import { env } from 'cloudflare:workers';

// 1. Explicitly define the expected payload interface for the TS Compiler
interface CartPayload {
  items: any[];
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  try {
    // 2. Safely typecast the unknown JSON response       
    const payload = (await request.json()) as CartPayload;
    const items = payload.items;

    if (!items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Invalid cart payload' }), {
        status: 400,
      });
    }

    // 3. Identify the Cart Owner (Logged-in User vs. Anonymous Guest)
    let cartSessionId = locals.session?.id;

    if (!cartSessionId) {
      // If no secure session exists, establish an anonymous guest tracker
      let guestId = cookies.get('symeno_guest_cart')?.value;

      if (!guestId) {
        guestId = crypto.randomUUID();
        // Set a 7-day HttpOnly cookie for the guest      
        cookies.set('symeno_guest_cart', guestId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
        });
      }
      cartSessionId = `guest_${guestId}`;
    } else {
      cartSessionId = `user_${cartSessionId}`;
    }

    if (!env) {
      throw new Error('Environment context missing.');
    }

    // 4. Persist the state to Cloudflare KV Edge
    await cacheCartState(env, cartSessionId, { items });

    return new Response(JSON.stringify({ success: true, synced: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('[KV_CART_SYNC_ERROR] Edge persistence failed', error);
    return new Response(JSON.stringify({ error: 'Edge sync failed' }), {
      status: 500,
    });
  }
};