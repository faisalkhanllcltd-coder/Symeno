import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async (context) => {
  const sessionId = context.cookies.get('auth_session')?.value;

  if (!sessionId) {
    return new Response(null, { status: 401 });
  }

  const kvStore = env.SESSION;

  if (!kvStore) {
    console.error('[AUTH_FATAL] KV binding missing in session hydration.');
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }

  const sessionData = await kvStore.get(`session:${sessionId}`);

  if (!sessionData) {
    // Session exists in cookie but was deleted from KV (e.g., remote logout)
    return new Response(null, { status: 401 });
  }

  // THE FIX: Return the raw sessionData string directly. 
  // It is already JSON, so `this.user = await res.json()` in the frontend will parse it perfectly without double-nesting.
  return new Response(sessionData, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};