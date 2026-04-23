import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies }) => {
  const session = cookies.get('symeno_session')?.value;
  
  if (session === 'admin_secure_token_123') {
    // Return standard Identity Matrix matching the Svelte auth store
    return new Response(JSON.stringify({
      id: 'admin_master_01',
      email: 'operator@symeno.com',
      firstName: 'Client',
      lastName: 'Operator',
      role: 'ADMIN'
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
  
  return new Response(JSON.stringify({ error: 'Unauthorized payload' }), { status: 401 });
};
