import type { AstroCookies } from 'astro';

const SESSION_COOKIE = 'auth_session';
const SESSION_TTL = 604800; // 7 days

function base64UrlEncode(buffer: ArrayBuffer | Uint8Array): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(base64Url: string): Uint8Array {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

export async function createSession(env: any, cookies: AstroCookies, payload: { id: string, email: string, role: string, firstName?: string, lastName?: string }) {
    const jti = crypto.randomUUID();
    const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
    const jwtPayload = { ...payload, jti, exp };

    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(jwtPayload)));
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    if (!env.JWT_SECRET) throw new Error('[AUTH_FATAL] JWT_SECRET is missing from environment.');

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(env.JWT_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(dataToSign));
    const token = `${dataToSign}.${base64UrlEncode(signature)}`;

    // THE FIX: Do not enforce "secure: true" on localhost HTTP, otherwise the browser drops it.
    const isProd = import.meta.env ? import.meta.env.PROD : true;

    cookies.set(SESSION_COOKIE, token, {
        path: '/',
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax', // Changed from strict to lax to survive cross-page redirects
        maxAge: SESSION_TTL,
    });

    return jti;
}

export async function verifyJWT(token: string, secret: string) {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToSign = `${headerB64}.${payloadB64}`;

    const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    // THE FIX: Cast to any to bypass strict TS BufferSource signature mismatch
    const isValid = await crypto.subtle.verify('HMAC', key, base64UrlDecode(signatureB64) as any, new TextEncoder().encode(dataToSign));
    if (!isValid) throw new Error('Invalid JWT signature');

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error('JWT expired');

    return payload;
}

// THE FIX: Prefix env with underscore to clear unused variable warning
export async function destroySession(_env: any, cookies: AstroCookies) {
    cookies.delete(SESSION_COOKIE, { path: '/' });
}