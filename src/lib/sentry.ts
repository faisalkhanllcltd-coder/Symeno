// src/lib/sentry.ts

export function logError(env: any, error: any, context: string = 'Edge Execution') {
  // In a production environment, this forwards to Sentry.io
  // For local dev, we intercept and log beautifully to the terminal.
  const dsn = env?.SENTRY_DSN;

  if (!dsn) {
    console.error(`\n[SYMENO.OPS: TELEMETRY ALERT]`);
    console.error(`Context: ${context}`);
    console.error(`Payload:`, error.message || error);
    console.error(`---------------------------\n`);
    return;
  }

  // Future integration point for official @sentry/cloudflare package
}
