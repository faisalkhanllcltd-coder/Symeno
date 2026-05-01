export function getKV(env: any) {
  return env?.KV;
}

export async function cacheCartState(
  env: any,
  sessionId: string,
  cartData: any,
  ttlInSeconds = 86400
) {
  const kv = getKV(env);
  if (!kv) {
    console.warn('[KV_SYSTEM] Binding missing. Edge caching aborted.');
    return;
  }

  // Store cart payload for 24 hours at the Edge
  await kv.put(`cart:${sessionId}`, JSON.stringify(cartData), {
    expirationTtl: ttlInSeconds,
  });
}

export async function fetchCartState(env: any, sessionId: string) {
  const kv = getKV(env);
  if (!kv) return null;

  const data = await kv.get(`cart:${sessionId}`);
  return data ? JSON.parse(data) : null;
}
