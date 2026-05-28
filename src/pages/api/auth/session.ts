import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyJWT } from '../../../lib/auth';

export const GET: APIRoute = async (context) => {
  const token = context.cookies.get('auth_session')?.value;

  if (!token) {
    return new Response(null, { status: 401 });
  }

  try {
    const secret = (env as any).JWT_SECRET;
    if (!secret) {
      console.error('[AUTH_FATAL] JWT_SECRET missing in environment.');
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }

    // FIXED: Cryptographically verify the JWT string instead of looking for it in KV
    const payload = await verifyJWT(token, secret);

    if (!payload) {
      return new Response(null, { status: 401 });
    }

    // Optional: You can still check KV here strictly for revocation (e.g., if a user was banned)
    // but the session itself lives securely in the JWT payload.

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[AUTH_SESSION_ERROR]', error);
    return new Response(null, { status: 401 });
  }
};