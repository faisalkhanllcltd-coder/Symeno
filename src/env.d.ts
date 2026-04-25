/// <reference path="../worker-configuration.d.ts" />
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />     

declare module "cloudflare:workers" {
  import { D1Database, KVNamespace, R2Bucket } from "@cloudflare/workers-types";
  export interface Env {
    DB: D1Database;
    KV: KVNamespace;
    SESSION: KVNamespace;
    IMAGES: R2Bucket;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    RESEND_API_KEY: string;
  }
  export const env: Env;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: import("cloudflare:workers").Env;
      ctx: ExecutionContext;
    };
    user?: {
      id: string;
      email: string;
      role: "admin" | "customer" | "staff";
      firstName?: string;
      lastName?: string;
    } | null;
    session?: {
      id: string;
    } | null;
  }
}