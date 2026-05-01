import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ cookies }) => {
  const sessionId = cookies.get('auth_session')?.value;
  if (!sessionId) return new Response(JSON.stringify({ error: 'No session found.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const kv = (env as any).KV || (env as any).SESSION;
  if (!kv) return new Response(JSON.stringify({ error: 'KV store missing.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  const sessionKey = `session:${sessionId}`;
  const sessionData = await kv.get(sessionKey);

  if (!sessionData) return new Response(JSON.stringify({ error: 'Session expired.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  // Extend KV session for another 7 days
  await kv.put(sessionKey, sessionData, { expirationTtl: 604800 });

  // Extend Cookie for another 7 days
  cookies.set('auth_session', sessionId, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 604800,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
