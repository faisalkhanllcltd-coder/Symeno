import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    // 1. Strict Perimeter Defense
    if (!locals.user || locals.user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'UNAUTHORIZED_ACCESS' }), {
        status: 403,
      });
    }

    const db = env.DB;
    const startTime = performance.now();
    let dbStatus = 'healthy';
    let dbLatency = 0;

    // 2. Ultra-Lightweight Database Ping
    try {
      await db.prepare('SELECT 1').first();
      dbLatency = Math.round(performance.now() - startTime);
    } catch (e) {
      dbStatus = 'degraded';
      dbLatency = -1;
    }

    // 3. Telemetry Payload Construction
    const telemetry = {
      status: dbStatus === 'healthy' ? 'OPERATIONAL' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      region: (env as any).CF_RAY?.split('-')[1] || 'EDGE_NODE', // Extracts Cloudflare datacenter location if available
      metrics: {
        database_latency_ms: dbLatency,
        environment: import.meta.env.MODE || 'production',
      },
    };

    return new Response(JSON.stringify(telemetry), {
      status: dbStatus === 'healthy' ? 200 : 503,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    // Failsafe catch for catastrophic edge failure
    return new Response(
      JSON.stringify({
        status: 'CRITICAL_FAILURE',
        timestamp: new Date().toISOString(),
      }),
      { status: 500 }
    );
  }
};
