import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import sentry from '@sentry/astro';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // We use server output because this is a dynamic e-commerce edge app, not a static blog.
  output: 'server',

  integrations: [
    svelte(),
    // APM UPGRADE: Sentry for full-stack edge observability
    sentry(),
    mdx()
  ],

  vite: {
    // UI UPGRADE: Native Vite plugin for Tailwind v4 (CSS-first engine)
    plugins: [tailwindcss()],
    // THE FIX: Bypass the SSR dependency optimizer for Sentry to prevent Vite cache corruption
    optimizeDeps: {
      exclude: ['@sentry/astro', '@sentry/astro/middleware']
    }
  },

  adapter: cloudflare({
    // This allows us to access D1, KV, and R2 locally during development
    platformProxy: {
      enabled: true,
    },
    // Routes image requests through Cloudflare's native optimization engine
    imageService: 'cloudflare',
  }),
});