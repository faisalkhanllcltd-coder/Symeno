import * as Sentry from "@sentry/astro";

Sentry.init({
  // Server-side only, kept secure at the Edge
  dsn: import.meta.env.SENTRY_DSN || process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
