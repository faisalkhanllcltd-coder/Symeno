export const logger = {
  info: (message: string, context?: any) => {
    console.log(`[INFO] ${message}`, context ? JSON.stringify(context) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
    // Future: Wire Sentry.captureException(error) here
  },
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, context ? JSON.stringify(context) : '');
  }
};
