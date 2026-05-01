import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async () => {
  // CRITICAL: Prevent Cloudflare Edge from caching this response.
  // We need a live execution every time the uptime monitor pings.
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  try {
    const db = (env as any).DB;
    
    // The absolute lightest query possible to verify D1 connectivity
    await db.prepare('SELECT 1 AS pulse').first();

    return new Response(
      JSON.stringify({
        status: 'ok',
        db: 'ok',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('[HEALTH_CHECK_FAILED]', error);
    
    return new Response(
      JSON.stringify({
        status: 'error',
        db: 'disconnected',
        timestamp: new Date().toISOString()
      }),
      { status: 503, headers }
    );
  }
};
