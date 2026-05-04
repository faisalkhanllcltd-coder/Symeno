import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export const POST: APIRoute = async (context) => {
  try {
    const formData = await context.request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No image provided.' }), {
        status: 400,
      });
    }

    // STRICT SECURITY: Whitelist MIME types to prevent executable uploads
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return new Response(
        JSON.stringify({
          error: 'Invalid file format. Only JPG, PNG, and WebP are permitted.',
        }),
        { status: 415 }
      );
    }

    const safeExtension = EXTENSION_MAP[file.type];
    const fileName = `products/${crypto.randomUUID()}.${safeExtension}`;

    // Attempt R2 upload if the IMAGES binding is available
    const r2 = (env as any).IMAGES;
    if (r2) {
      await r2.put(fileName, await file.arrayBuffer(), {
        httpMetadata: { contentType: file.type },
      });

      // R2 public URL pattern: https://<bucket>.r2.dev/<key> or custom domain
      const publicUrl = `https://images.symeno.com/${fileName}`;

      return new Response(
        JSON.stringify({
          success: true,
          url: publicUrl,
        }),
        { status: 200 }
      );
    }

    // Fallback: R2 binding not configured — store locally and return a data URI reference
    // This ensures the admin panel remains functional during development
    return new Response(
      JSON.stringify({
        success: false,
        error: 'R2 storage binding (IMAGES) is not configured. Enable the [[r2_buckets]] section in wrangler.toml to activate image uploads.',
      }),
      { status: 503 }
    );
  } catch (error: unknown) {
    console.error('[UPLOAD_ERROR]', error);
    return new Response(JSON.stringify({ error: 'Upload failed.' }), {
      status: 500,
    });
  }
};
