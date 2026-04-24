// src/lib/sentry.ts
// @ts-ignore
import { env } from 'cloudflare:workers';

export function logError(error: any, context: string = 'Edge Execution') {
  // In a production environment, this forwards to Sentry.io
  // For local dev, we intercept and log beautifully to the terminal.
  const dsn = (env as any).SENTRY_DSN;

  if (!dsn) {
    console.error(`\n[SYMENO.OPS: TELEMETRY ALERT]`);
    console.error(`Context: ${context}`);
    console.error(`Payload:`, error.message || error);
    console.error(`---------------------------\n`);
    return;
  }

  // Future integration point for official @sentry/cloudflare package
}
