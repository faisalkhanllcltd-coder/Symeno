import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { destroySession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  await destroySession(env, cookies);
  return redirect('/auth/login');
};

// Also support GET for simple link-based logouts during development
export const GET: APIRoute = POST;