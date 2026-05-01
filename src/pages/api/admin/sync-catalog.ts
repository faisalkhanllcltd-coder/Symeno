import type { APIRoute } from 'astro';
export const POST: APIRoute = async (context) => {
  if (!context.locals.user || (context.locals.user.role !== 'admin' && context.locals.user.role !== 'staff')) return new Response('Unauthorized', { status: 401 });
  try {
    const db = context.locals.runtime?.env?.DB;
    if (!db) throw new Error("DB Offline");
    return new Response(JSON.stringify({ success: true }));
  } catch(e:any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
