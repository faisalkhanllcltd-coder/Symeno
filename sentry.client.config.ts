import * as Sentry from '@sentry/astro';

Sentry.init({
  // Use PUBLIC_ prefix so it is safely exposed to the browser
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // Adjusted for production performance
});
