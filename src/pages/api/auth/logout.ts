import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const sessionId = cookies.get('auth_session')?.value;

  if (sessionId) {
    const kv = (env as any).KV;
    if (kv) {
      await kv.delete(`session:${sessionId}`);
    }
  }

  cookies.delete('auth_session', { path: '/' });
  return redirect('/auth/login');
};

// Also support GET for simple link-based logouts during development
export const GET: APIRoute = POST;
