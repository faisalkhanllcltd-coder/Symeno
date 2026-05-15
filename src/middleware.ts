import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { verifyJWT } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
    const { request, url, cookies, redirect, locals } = context;
    const safeEnv = env as any;

    // --------------------------------------------------------
    // 1. CSRF PROTECTION (Origin checking for state mutations)
    // --------------------------------------------------------
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');

        if (origin && host && new URL(origin).host !== host) {
            console.warn(`[SECURITY_BLOCKED] CSRF attempt from origin: ${origin}`);
            return new Response(JSON.stringify({ error: 'Cross-Site Request Forgery detected.' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }

    // --------------------------------------------------------
    // 2. THE TURNSTILE GLOBAL API GUARD
    // --------------------------------------------------------
    // Define exact API endpoints that MUST have a valid Turnstile token on POST.
    const PROTECTED_ENDPOINTS = [
        '/api/auth/register',
        '/api/auth/login',
        '/api/auth/forgot-password',
        '/api/auth/reset-password',
        '/api/support/contact',
        '/api/marketing/newsletter',
        '/api/b2b/apply',
        '/api/checkout/process',
        '/api/account/returns',
        '/api/reviews'
    ];

    if (request.method === 'POST' && PROTECTED_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
        try {
            // Clone the request so we can read the JSON body without breaking the downstream API endpoints.
            const clonedRequest = request.clone();

            // THE FIX: Explicitly cast the parsed JSON so TypeScript knows it is an object
            const body = await clonedRequest.json() as Record<string, any>;
            const token = body['cf-turnstile-response'];

            if (!token) {
                console.warn(`[TURNSTILE_BLOCKED] Missing token on ${url.pathname}`);
                return new Response(JSON.stringify({ success: false, error: 'Security token missing. Are you human?' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            // Cryptographic Verification via Cloudflare Edge
            const secretKey = safeEnv?.TURNSTILE_SECRET_KEY || (context.locals as any).runtime?.env?.TURNSTILE_SECRET_KEY || import.meta.env.TURNSTILE_SECRET_KEY;

            if (!secretKey) {
                console.error('[SECURITY_FATAL] TURNSTILE_SECRET_KEY missing from environment.');
                return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500 });
            }

            const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
            const verifyResponse = await fetch(verifyEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
            });

            // THE FIX: Explicitly cast the Cloudflare verification response
            const verifyData = await verifyResponse.json() as Record<string, any>;

            // The Kill-Switch: Reject if Cloudflare declares the token invalid
            if (!verifyData.success) {
                console.warn('[TURNSTILE_BLOCKED] Failed verification:', verifyData['error-codes']);
                return new Response(JSON.stringify({ success: false, error: 'Security verification failed.' }), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            console.log(`[TURNSTILE_PASSED] Human verified for ${url.pathname}`);

        } catch (error) {
            // Catch JSON parsing errors or fetch failures
            console.error('[TURNSTILE_ERROR] Middleware processing error:', error);
            return new Response(JSON.stringify({ error: 'Invalid request format.' }), { status: 400 });
        }
    }


    // --------------------------------------------------------
    // 3. AUTHENTICATION & ROUTE GUARDING
    // --------------------------------------------------------
    const isAdminRoute = url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin');
    const isAccountRoute = url.pathname.startsWith('/account') || url.pathname.startsWith('/api/account');
    const isSecureApiRoute = url.pathname.startsWith('/api/auth/change-');
    const isCheckoutRoute = url.pathname.startsWith('/checkout');

    if (isAdminRoute || isAccountRoute || isSecureApiRoute || isCheckoutRoute) {
        const sessionToken = cookies.get('auth_session')?.value;

        if (!sessionToken) {
            if (isSecureApiRoute) {
                return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (isCheckoutRoute) {
                return redirect('/auth/login?returnTo=/checkout');
            }
            return redirect('/auth/login');
        }

        try {
            if (!safeEnv?.JWT_SECRET) {
                throw new Error('[AUTH_FATAL] JWT_SECRET missing in environment.');
            }

            const user = await verifyJWT(sessionToken, safeEnv.JWT_SECRET as string);

            const kvStore = safeEnv?.SESSION || safeEnv?.KV;
            if (kvStore && user.jti) {
                const isRevoked = await kvStore.get(`revoked:${user.jti}`);
                if (isRevoked) {
                    throw new Error('Session revoked by security policy.');
                }
            }

            locals.user = user;

            const role = (user.role || '').toLowerCase();
            if (isAdminRoute && !['admin', 'manager', 'staff'].includes(role)) {
                console.warn(`[SECURITY_BLOCKED] Customer ${user.email} attempted to access Admin UI.`);
                return redirect('/account');
            }
        } catch (err) {
            console.error('[AUTH_FATAL] Session verification failed:', err);
            cookies.delete('auth_session', { path: '/' });
            if (isSecureApiRoute) {
                return new Response(JSON.stringify({ error: 'Unauthorized.' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (isCheckoutRoute) {
                return redirect('/auth/login?returnTo=/checkout');
            }
            return redirect('/auth/login');
        }
    }

    // --------------------------------------------------------
    // 4. EXECUTE ROUTE & INJECT SECURITY HEADERS
    // --------------------------------------------------------
    const response = await next();
    const secureResponse = new Response(response.body, response);

    secureResponse.headers.set('X-Content-Type-Options', 'nosniff');
    secureResponse.headers.set('X-Frame-Options', 'DENY');
    secureResponse.headers.set('X-XSS-Protection', '1; mode=block');
    secureResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    secureResponse.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;"
    );

    return secureResponse;
});