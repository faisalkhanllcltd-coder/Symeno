import type { APIRoute } from "astro";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const POST: APIRoute = async (context) => {
  try {
    const formData = await context.request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No image provided." }), { status: 400 });
    }

    // STRICT SECURITY: Whitelist MIME types to prevent executable uploads
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return new Response(JSON.stringify({ error: "Invalid file format. Only JPG, PNG, and WebP are permitted." }), { status: 415 });
    }

    const safeExtension = EXTENSION_MAP[file.type];
    const fileName = `products/${crypto.randomUUID()}.${safeExtension}`;

    // Here you would interface with the R2 bucket directly
    // Example: await (env as any).IMAGES.put(fileName, await file.arrayBuffer());

    return new Response(JSON.stringify({ success: true, url: `https://mock-r2.symeno.com/${fileName}` }), { status: 200 });
  } catch (error: unknown) {
    return new Response(JSON.stringify({ error: "Upload failed." }), { status: 500 });
  }
};