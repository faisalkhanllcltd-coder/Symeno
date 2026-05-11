# Symeno | Edge-Native Commerce Platform

Symeno is a high-performance, edge-rendered storefront built for volume hardware distribution and retail arbitrage. It collapses the retail margin by leveraging edge computing, dynamic caching, and a highly optimized UI matrix to deliver a premium, conversion-focused user experience.

## ⚡ Architecture & Tech Stack

This platform is engineered for maximum LCP (Largest Contentful Paint) speed, edge-first rendering, and zero-layout-shift interactivity.

* **Framework:** Astro (Configured for server output / SSR)
* **Reactivity:** Svelte 5 (Utilizing the Runes API .svelte.ts for global Cart and History state)
* **Styling:** Tailwind CSS v4 (CSS-first engine, avoiding color-mix collisions via custom CSS variables)
* **Edge Infrastructure:** Cloudflare Pages & Workers
* **Datastore:** Cloudflare D1 (Edge SQLite)
* **Session State:** Cloudflare KV (SESSION binding)
* **Observability:** Sentry (@sentry/astro for full-stack edge monitoring)

## 🛠 Prerequisites

Before spinning up the environment, ensure you have the following installed:
* **Node.js** (v20.0.0 or higher)
* **npm** (v9.0.0 or higher)
* **Wrangler CLI** (
pm install -g wrangler)

## 🚀 Local Development Environment

We utilize Astro's Cloudflare adapter with platformProxy enabled. This safely emulates Cloudflare D1, KV, and R2 locally without needing live network requests.

1. **Clone and Install:**
   \\\ash
   npm install
   \\\

2. **Initialize Local Environment Variables:**
   Create a .dev.vars file in the root directory. You MUST map your database and session bindings here:
   \\\env
   # .dev.vars
   ENVIRONMENT=development
   # Sentry tokens (if applicable locally)
   SENTRY_AUTH_TOKEN=your_token_here
   \\\

3. **Boot the Edge Server:**
   \\\ash
   npm run dev
   \\\
   The local environment will spin up at http://localhost:4321. Note: Watch out for Vite/FSWatcher MaxListeners warnings—they are benign in local dev.

## 🗄 Edge Database (Cloudflare D1) Architecture

The platform relies on a heavily cached D1 database schema (catalog_cache) for instant read speeds globally.

**Core Schema Target (catalog_cache):**
* id: Primary Key (String/UUID)
* slug: URL-friendly identifier
* 
ame: Product Title
* rand: Manufacturer (Defaults to 'Symeno Select' if null)
* price: Base Arbitrage Price (Numeric)
* in_stock: Integer flag (1 = True, 0 = False)
* images_json: Stringified JSON array of image URLs
* category: Taxonomy classification
* ating / eview_count: Telemetry data

## 🎨 UI/UX Design System

The Symeno interface completely avoids "soft" AI-generated aesthetics in favor of a **Logistics Data Matrix** design language.

* **Image Staging:** Strict control using spect-square or spect-[16/10] paired with object-contain and deep padding (e.g., p-6) to protect hardware imagery from aggressive cropping.
* **Typography:** High-contrast 	ext-white or 	ext-content against dark gradients. Monospace micro-data labels (	ext-[10px]) are used for telemetry and specs.
* **Scrollbars:** Custom, slim scrollbars injected strictly on overflowing containers to prevent Chromium paint exhaustion. 
* **Accessibility:** Minimum 44px touch targets (min-h-[44px]) on all interactive UI elements.
* **Bento Grids:** Category matrices rely on strict array slicing (Featured, Top 4, Mid 3, Bottom 2) to maintain perfect masonry layouts without empty slots.

## 📦 Deployment Pipeline

Deployments are handled automatically via Cloudflare Pages CI/CD, but can be triggered manually via Wrangler.

1. **Build the production bundle:**
   \\\ash
   npm run build
   \\\

2. **Deploy to Cloudflare Edge:**
   \\\ash
   wrangler pages deploy ./dist
   \\\

## 🛡 Performance Mandates

Any new code introduced to this repository must adhere to the following strict rules:
1. **Zero Dummy Code:** No placeholder logic or dead buttons. If it ships, it works.
2. **Crash-Proof CSS:** Do not mix gba() strings with Hex codes in Tailwind v4 @theme directives.
3. **Optimized Caching:** All dynamic routes must utilize Cloudflare CDN headers (Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400) where applicable.
