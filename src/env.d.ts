/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="svelte" />

type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type D1Database = import("@cloudflare/workers-types").D1Database;

// Explicitly declare the cloudflare:workers env module
declare module "cloudflare:workers" {
  export const env: {
    DB: D1Database;
    KV?: KVNamespace;
    SESSION?: KVNamespace;
  };
}

// Keep the global App.Locals for Astro context
declare namespace App {
  interface Locals {
    user: any | null;
    session?: { id: string };
  }
}