import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { destroySession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Destroy the HttpOnly cookie securely
    await destroySession(env, cookies);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[AUTH_LOGOUT_ERROR]', error);
    return new Response(JSON.stringify({ error: 'Logout failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};