import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';

export const onRequest = defineMiddleware(async (context, next) => {
    const { request, url, cookies, redirect, locals } = context;

    // --------------------------------------------------------
    // 1. CSRF PROTECTION (Origin checking for state mutations)
    // --------------------------------------------------------
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        const origin = request.headers.get('origin');
        const host = request.headers.get('host');

        // If an Origin header exists, it must match our host
        if (origin && host && new URL(origin).host !== host) {
            console.warn(`[SECURITY_BLOCKED] CSRF attempt from origin: ${origin}`);
            return new Response('Cross-Site Request Forgery detected.', { status: 403 });
        }
    }

    // --------------------------------------------------------
    // 2. AUTHENTICATION & ROUTE GUARDING
    // --------------------------------------------------------
    const isAdminRoute = url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/admin');
    const isAccountRoute = url.pathname.startsWith('/account') || url.pathname.startsWith('/api/account');
    const isSecureApiRoute = url.pathname.startsWith('/api/auth/change-');

    if (isAdminRoute || isAccountRoute || isSecureApiRoute) {
        const sessionId = cookies.get('auth_session')?.value;

        if (!sessionId) {
            if (isSecureApiRoute) {
                return new Response(JSON.stringify({ error: 'Unauthorized.' }), { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return redirect('/auth/login');
        }

        const kvStore = env?.SESSION;

        if (!kvStore) {
            console.error('[AUTH_FATAL] KV namespace binding missing in middleware.');
            return new Response('Internal Server Error', { status: 500 });
        }

        // Fetch session from Cloudflare KV
        const sessionData = await kvStore.get(`session:${sessionId}`);

        if (!sessionData) {
            // Session expired or deleted remotely. Nuke the stale cookie.
            cookies.delete('auth_session', { path: '/' });
            if (isSecureApiRoute) {
                return new Response(JSON.stringify({ error: 'Unauthorized.' }), { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return redirect('/auth/login');
        }

        try {
            const user = JSON.parse(sessionData);

            // Attach user to context so standard Astro pages can access `Astro.locals.user`
            locals.user = user;

            // RBAC Enforcement (Admins/Managers only in /admin)
            if (isAdminRoute && user.role !== 'admin' && user.role !== 'manager') {
                console.warn(`[SECURITY_BLOCKED] Customer ${user.email} attempted to access Admin UI.`);
                return redirect('/account');
            }
        } catch (err) {
            console.error('[AUTH_FATAL] Corrupted session JSON.', err);
            cookies.delete('auth_session', { path: '/' });
            if (isSecureApiRoute) {
                return new Response(JSON.stringify({ error: 'Unauthorized.' }), { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            return redirect('/auth/login');
        }
    }

    // --------------------------------------------------------
    // 3. EXECUTE ROUTE & INJECT SECURITY HEADERS
    // --------------------------------------------------------
    const response = await next();

    // Clone the response to ensure headers are mutable
    const secureResponse = new Response(response.body, response);

    secureResponse.headers.set('X-Content-Type-Options', 'nosniff');
    secureResponse.headers.set('X-Frame-Options', 'DENY');
    secureResponse.headers.set('X-XSS-Protection', '1; mode=block');
    secureResponse.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    // Baseline CSP. Allows Cloudflare Turnstile, local scripts, and standard assets.
    secureResponse.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;"
    );

    return secureResponse;
});