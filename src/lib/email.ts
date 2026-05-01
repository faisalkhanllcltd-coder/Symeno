// src/lib/email.ts

interface FetchTimeoutOptions extends RequestInit {
  timeout?: number;
}

/**
 * Edge-Safe Fetch Wrapper
 * Prevents Cloudflare Worker isolates from hanging indefinitely if an external API (like Resend) stalls.
 */
const fetchWithTimeout = async (
  resource: string,
  options: FetchTimeoutOptions = {}
) => {
  const { timeout = 5000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Dispatches emails via Resend using Edge-native fetch.
 * NOTE: When calling this inside an API route, ALWAYS wrap it in `context.locals.runtime.ctx.waitUntil()`
 * so the email finishes sending in the background after the response is sent to the user.
 */
export const sendEmail = async (
  env: any,
  options: SendEmailOptions
): Promise<boolean> => {
  const apiKey = env?.RESEND_API_KEY;

  if (!apiKey) {
    console.error(
      '[EMAIL_FATAL] RESEND_API_KEY is missing from environment bindings.'
    );
    return false;
  }

  try {
    const res = await fetchWithTimeout('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Symeno <no-reply@symeno.com>', // Update with your verified Resend domain
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>?/gm, ''), // Basic text fallback
      }),
      timeout: 5000, // Strict 5-second limit
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[EMAIL_API_ERROR] Resend responded with ${res.status}: ${errorText}`
      );
      return false;
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const isTimeout = error.name === 'AbortError';
      console.error(
        `[EMAIL_DISPATCH_ERROR] ${isTimeout ? 'Request timed out after 5s' : error.message}`
      );
    }
    return false;
  }
};
