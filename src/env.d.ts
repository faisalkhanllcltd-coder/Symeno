/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
type Env = { DB: any; SESSION: any; KV: any;[key: string]: any };
declare namespace App {
  interface Locals {
    runtime: import('@astrojs/cloudflare').Runtime<Env>;
    session: { id: string;[key: string]: any } | null;
    user: { id: string; email: string; role: 'admin' | 'staff' | 'customer' } | null;
  }
}