import type { APIRoute } from "astro";

export const POST: APIRoute = async (context) => {
  // Explicitly assert the type to satisfy the TS compiler
  const data = (await context.request.json()) as Record<string, any>;
  
  // We will connect this back to D1 after we bypass the login
  console.log("Mock saved product:", data.title);
  
  return new Response(JSON.stringify({ success: true, productId: "mock-id" }), { status: 200 });
};
