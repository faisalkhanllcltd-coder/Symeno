import type { AstroCookies } from 'astro';

const SESSION_COOKIE = 'auth_session';
const SESSION_TTL = 604800; // 7 days in seconds

export async function createSession(env: any, cookies: AstroCookies, payload: { id: string, email: string, role: string }) {
    const sessionId = crypto.randomUUID();

    // Safely fallback between configurations
    const kv = env.SESSION || env.KV;
    if (!kv) throw new Error('[AUTH_FATAL] KV Namespace binding is missing.');

    await kv.put(`session:${sessionId}`, JSON.stringify(payload), { expirationTtl: SESSION_TTL });

    cookies.set(SESSION_COOKIE, sessionId, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: SESSION_TTL,
    });

    return sessionId;
}

export async function destroySession(env: any, cookies: AstroCookies) {
    const sessionId = cookies.get(SESSION_COOKIE)?.value;

    if (sessionId) {
        const kv = env.SESSION || env.KV;
        if (kv) {
            await kv.delete(`session:${sessionId}`);
        }
    }

    cookies.delete(SESSION_COOKIE, { path: '/' });
}