/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />     

// 1. Strict Cloudflare Worker Bindings (Resolves ID 2.1.10)
// Renamed from 'Env' to 'CloudflareEnv' to prevent shadowing by native types
export type CloudflareEnv = {
  DB: D1Database;
  KV: KVNamespace;
  SESSION: KVNamespace;
  IMAGES: R2Bucket;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY: string;
};

// 2. Global Environment Registration
declare module 'cloudflare:workers' {
  export const env: CloudflareEnv;
}

// 3. Astro Locals & Authentication Matrix
declare namespace App {
  interface Locals {
    runtime: {
      env: CloudflareEnv;
      ctx: ExecutionContext;
    };
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'customer' | 'staff';
      firstName?: string;
      lastName?: string;
    } | null;
    session?: {
      id: string;
    } | null;
  }
}