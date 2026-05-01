import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const sessionId = context.cookies.get('auth_session')?.value;

  if (!sessionId) {
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }

  const env = (context.locals as any).runtime?.env;
  const kvStore = env?.SESSION || env?.KV;

  if (!kvStore) {
    console.error('[AUTH_FATAL] KV binding missing in session hydration.');
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }

  const sessionData = await kvStore.get(`session:${sessionId}`);

  if (!sessionData) {
    // Session exists in cookie but was deleted from KV (e.g., remote logout)
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }

  try {
    const user = JSON.parse(sessionData);
    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ user: null }), { status: 401 });
  }
};