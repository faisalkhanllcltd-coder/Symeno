# 🛡️ Final Underwriting Compliance Audit

**Auditor Role:** Principal Forensic Auditor & Compliance Underwriter
**Audit Scope:** `src/` directory — all `.astro`, `.svelte`, `.ts`, `.md`, `.json` files
**Target Reviewers:** Airwallex · Payoneer · Stripe (Tier-1 Payment Processors)
**Audit Date:** 2026-05-15
**Status:** ⚠️ REQUIRES REMEDIATION — See flagged items below

---

## Phase 1: Homepage Integrity & Fake Elements

> **Methodology:** Deep-scanned `src/pages/index.astro` and all components it imports: `Hero`, `TrustBar`, `CategoryGrid`, `BrandStory`, `Manifesto`, `FeaturedProducts`, `Testimonials`, `NewsletterCapture`.

### 1.1 Fake Urgency / FOMO Elements
**Result: CLEAN** ✅
No countdown timers, "Only X left!" hardcoded strings, or "Sale ends in X hours" text found in any homepage component. `BrandStory.astro` line 50 even explicitly states: *"We don't do flash sales. We don't do fake timers."*

---

### 1.2 Placeholder Text / Lorem Ipsum / TODO
**Result: CLEAN** ✅
All `placeholder` attributes found are legitimate HTML form input hints (e.g., `placeholder="Search inventory..."`), not content placeholders. No Lorem Ipsum, TODO, or "Insert text here" strings detected. All `/assets/placeholders/product-unavailable.webp` references are functional fallback images — not third-party placeholder services like `placehold.co`.

---

### 1.3 Unrealistic Hardcoded Review/Rating Claims
**Result: ⚠️ FLAG — HIGH RISK**

| File | Line | Element Found | Risk |
|---|---|---|---|
| `src/components/storefront/Testimonials.astro` | 10–33 | `fallbackReviews` — 3 hardcoded fabricated testimonials displayed when DB has fewer than 3 real reviews | **CRITICAL:** Fabricated social proof is displayed to live users. Two reviews have `rating: 5`, one has `rating: 4`. The fake reviewer "Michael R." praises a **KitchenAid** product (a banned brand — see Phase 2). This fallback fires on an empty or low-volume DB, meaning a reviewer will almost certainly see it. |
| `src/components/storefront/Testimonials.astro` | 12–13 | `product_name: 'KitchenAid Classic 15-Piece'` in fallback testimonial | **CRITICAL:** A banned brand name is hardcoded into a customer-facing testimonial that renders as real data. |

**Recommended Fix:** Replace fabricated `fallbackReviews` with a neutral "No reviews yet" empty state. Never display synthetic testimonials as organic customer feedback.

---

### 1.4 Broken Links / Empty `href="#"` / Broken Image Paths
**Result: CLEAN** ✅
No `href="#"` or `href=""` empty anchor tags found. All internal links use correct relative paths (`/shop`, `/about`, `/contact`, etc.). Image fallback paths use the project's own `/assets/placeholders/product-unavailable.webp`.

---

## Phase 2: Ghost Banned Items

> **Methodology:** Global regex/text search across entire `src/` tree for banned product strings.

### 2.1 Medical Items
**Search Terms:** `15-20mmHg`, `Compression Socks`, `Acupressure`, `Acupuncture`, `Physical Therapy`
**Result: CLEAN** ✅

---

### 2.2 Topicals
**Search Terms:** `Beard Oil`, `Beard Balm`, `Face Serum`, `Skincare Tools`

**Result: ⚠️ FLAG — HIGH RISK**

| File | Line | Exact String Found |
|---|---|---|
| `src/pages/api/admin/sync-catalog.ts` | 18 | `"Skincare Tools": ["gua sha rose quartz set", "jade roller face"]` |
| `src/pages/api/admin/sync-catalog.ts` | 17 | `"Men's Grooming": ["beard grooming set"]` |

**Assessment:** The `sync-catalog` API actively scrapes and ingests products matching banned category names into the production D1 database. Even if these products are manually purged from `catalog_cache`, the next automated sync call will re-inject them. The category keys `"Skincare Tools"` and `"Men's Grooming"` (with "beard grooming set" as a search term) are live execution paths. This is a **systemic re-contamination vector**, not a stale string.

---

### 2.3 Weapons
**Search Terms:** `Damascus Knife`, `Box Cutter`, `Safety Razor`, `Glass Breaker`, `Double Edge`, `Straight Razor`
**Result: CLEAN** ✅

---

### 2.4 Banned Brands
**Search Terms:** `Amazon Basics`, `Amazon Essentials`, `Anker`, `KitchenAid`, `AirTag`, `Apple`, `MagSafe`

**Result: ⚠️ FLAG — HIGH RISK**

| File | Line | Exact String Found |
|---|---|---|
| `src/components/storefront/Testimonials.astro` | 12 | `body: 'Secured the complete KitchenAid array...'` |
| `src/components/storefront/Testimonials.astro` | 13 | `product_name: 'KitchenAid Classic 15-Piece'` |
| `src/pages/index.astro` | 30 | `const HOMEPAGE_BLACKLIST = ['kitchenaid', 'kitchen aid'];` *(evidence of acknowledged contamination — but blacklist only applies to the Featured Products grid, not the Testimonials fallback)* |
| `src/pages/faq.astro` | 33 | `Apple Care eligible, Sony standard 1-year warranty` |
| `src/layouts/Storefront.astro` | 33 | `<link rel="apple-touch-icon" ...>` *(HTML standard meta tag — NOT a brand mention, informational only)* |
| `src/components/ui/navigation/Button.svelte` | 22 | `// FIX: Injected min-h-[44px] ... for strict WCAG/Apple touch target compliance` *(code comment — NOT customer-facing)* |

**Assessment:**
- `Testimonials.astro` lines 12–13: **CRITICAL.** `KitchenAid` is hardcoded in a customer-facing, visible testimonial.
- `faq.astro` line 33: **HIGH RISK.** The phrase `"Apple Care eligible"` is a named trademark reference explicitly linking your platform to Apple's premium service ecosystem. An underwriter will flag this as an implicit brand endorsement of a Tier-1 forbidden brand. The word `"Sony"` in the same sentence is also a brand anchor — it is not on the banned list but creates a precedent for specific brand warranty claims.
- `Storefront.astro` line 33 and `Button.svelte` line 22: **CLEAN** — standard HTML/accessibility metadata, not customer-facing brand mentions.

---

### 2.5 Raw Materials
**Search Terms:** `EVA Foam`, `Cosplay Foam`
**Result: CLEAN** ✅

---

### 2.6 Lexicon Risks

**Search Term: `Hardware` (should be 'Lifestyle' or 'Goods')**

**Result: ⚠️ FLAG — MEDIUM RISK**

The word `hardware` appears **35+ times** across the codebase in customer-facing contexts. Key locations:

| File | Line | Exact String Found |
|---|---|---|
| `src/pages/deals.astro` | 89 | `description="Secure premium hardware at global wholesale rates."` |
| `src/pages/new-arrivals.astro` | 77 | `description="The newest hardware injections to our logistics pipeline."` |
| `src/pages/new-arrivals.astro` | 100 | `Chronological feed of verified hardware injections.` |
| `src/pages/search.astro` | 9 | `Query: {query \| 'ALL HARDWARE'}` |
| `src/pages/search.astro` | 14 | `Global hardware indexing and arbitrage search...` |
| `src/pages/policies/authenticity.astro` | 7 | `description="Our zero-tolerance policy ... for counterfeit hardware."` |
| `src/pages/policies/authenticity.astro` | 23 | `...zero-tolerance policy for counterfeit, gray-market, or refurbished hardware...` |
| `src/pages/policies/authenticity.astro` | 46 | `...If any hardware is proven to be counterfeit...` |
| `src/pages/faq.astro` | 33 | `...our hardware is sourced through official distributor channels...` |
| `src/pages/faq.astro` | 45 | `...factory-sealed hardware can be returned...` |
| `src/pages/faq.astro` | 49 | `...we sell hardware at such tight margins...` |
| `src/pages/faq.astro` | 68 | `I need to procure hardware for my company.` |
| `src/pages/compare.astro` | 5 | `<StorefrontLayout title="Hardware Comparison">` |
| `src/pages/compare.astro` | 8 | `Hardware Comparison.` |
| `src/pages/checkout/success.astro` | 10 | `description="Your hardware order has been secured."` |
| `src/pages/brands/[brand].astro` | 45–46 | `${displayName} Hardware \| Symeno`, `Verified wholesale arbitrage for ${displayName} hardware.` |
| `src/pages/blog/index.astro` | 6 | `'How Global Arbitrage Drops Hardware Prices by 30%'` |
| `src/pages/brands/index.astro` | 34 | `description="Our network of verified hardware suppliers."` |
| `src/pages/b2b/index.astro` | 8 | `description="Corporate hardware acquisition and logistics."` |
| `src/pages/b2b/index.astro` | 16 | `SYMENO LLC provides zero-markup hardware routing...` |
| `src/pages/about.astro` | 7 | `description="How we source authentic hardware..."` |
| `src/pages/about.astro` | 19–29 | Multiple "hardware" mentions in customer-facing about copy |
| `src/pages/admin/products/index.astro` | 40 | `title="Hardware Catalog"` *(admin-only — lower risk)* |
| `src/pages/admin/products/new.astro` | 17, 22 | `'Provision Hardware'` *(admin-only — lower risk)* |
| `src/components/storefront/BrandStory.astro` | 24 | `Average customer savings across all hardware categories...` |
| `src/components/storefront/Testimonials.astro` | 12 | `...the only logical way to source hardware.` |
| `src/components/storefront/layout/Footer.astro` | 19 | `...global arbitrage to secure premium hardware at zero-markup wholesale` |
| `src/components/storefront/product/ProductSpecs.astro` | 13 | `Hardware Specifications` |
| `src/content/blog/launch-promo.mdx` | 9 | `Welcome to the new era of hardware procurement...` |
| `src/content/brands/specific-brand.mdx` | 8 | `All hardware components are verified authentic...` |
| `src/components/account/WishlistGrid.svelte` | 211 | `Explore the matrix to find hardware and upgrades.` |
| `src/components/account/rewards/RewardsProgram.svelte` | 12 | `Earn 1 point for every 1 AED spent on hardware or services.` |
| `src/pages/deals.astro` | 58 | `category: p.category \|\| 'Hardware'` *(default category fallback — injects the word into DB)* |
| `src/pages/shop/product/[slug].astro` | 46 | `category: rawProduct.category \|\| 'Hardware'` *(same)* |
| `src/pages/brands/[brand].astro` | 32 | `category: p.category \|\| 'Hardware'` *(same)* |

**Assessment:** The word "hardware" is deeply embedded as the brand's core vocabulary. This is a systemic lexicon issue. Underwriters flag this because "hardware" implies consumer electronics (MEID-trackable, warranty-liability, gray-market-prone goods). The mandated replacement is "Lifestyle Goods" or similar neutral language.

---

**Search Term: `Brand Partners` (should be 'Supply Partners')**

**Result: ⚠️ FLAG — LOW-MEDIUM RISK**

| File | Line | Exact String Found |
|---|---|---|
| `src/components/storefront/TrustBar.astro` | 25 | `Verified Brand Partners` |
| `src/components/storefront/Manifesto.astro` | 49 | `...brand partners. No unauthorized gray market goods. Ever.` |
| `src/components/storefront/BrandStory.astro` | 46–47 | `...negotiating bulk positions with authorized brand partners...` |

**Assessment:** "Brand Partners" implies IP licensing relationships with specific brands, which triggers questions about counterfeit risk and unauthorized resale during underwriting. "Supply Partners" or "Verified Distributors" is the mandated neutral replacement.

---

## Phase 3: Dropshipping / Underwriter Red Flags

### 3.1 Excessive Shipping Times (>14 days)
**Result: CLEAN** ✅
No language matching "2-4 weeks", "please allow", or multi-week delivery promises found. All `14 days` references found are for return windows and dispute deadlines (not delivery times), which are legitimate policy language.

---

### 3.2 Dropshipping / Third-Party Warehouse Language
**Result: ⚠️ FLAG — MEDIUM RISK**

| File | Line | Flag Found | Recommended Fix |
|---|---|---|---|
| `src/pages/faq.astro` | 20 | `question: 'Do you actually hold stock, or is this dropshipping?'` | **LOW RISK** — This is a defensive FAQ. The answer (line 21) correctly denies dropshipping. However, merely **including the word "dropshipping"** in visible page content can trigger keyword-based automated underwriting scanners. Consider rephrasing to: `"Do you own your inventory?"` |

---

### 3.3 Ghost Email: `info@symeno.com`
**Result: CLEAN** ✅
Zero instances of `info@symeno.com` found anywhere in `src/`. All email references use the canonical `support@symeno.com`.

---

### 3.4 Non-Canonical Emails Found (Secondary Issue)
**Result: ⚠️ FLAG — MEDIUM RISK**

| File | Line | Flag Found | Recommended Fix |
|---|---|---|---|
| `src/pages/faq.astro` | 162 | `href="mailto:contact@symeno.com"` — visible "Email Us" CTA button | Standardize to `support@symeno.com`. Multiple email addresses for customer contact raises questions about operational legitimacy. |
| `src/pages/policies/shipping.astro` | 31 | `Contact: contact@symeno.com` | Replace with `support@symeno.com`. |
| `src/pages/policies/authenticity.astro` | 63 | `mailto:contact@symeno.com` — dispute contact in legal policy page | **HIGH RISK.** A legal policy page must reference the canonical, monitored support address. Replace with `support@symeno.com`. |
| `src/pages/about.astro` | 180 | `mailto:wholesale@symeno.com` | Acceptable for B2B use-case, but underwriters may flag unlisted subdomains. Ensure `wholesale@symeno.com` is a real, forwarding address. |
| `src/emails/OrderReceipt.ts` | 51 | `contact@symeno.com` in transactional email footer | Replace with `support@symeno.com`. Transactional emails are reviewed during underwriting. |

---

### 3.5 `sync-catalog.ts` — Active Re-Contamination Risk
**Result: ⚠️ FLAG — CRITICAL**

| File | Line | Flag Found | Recommended Fix |
|---|---|---|---|
| `src/pages/api/admin/sync-catalog.ts` | 17 | `"Men's Grooming": ["beard grooming set"]` — active Amazon scrape term | **REMOVE** this category or purge search terms. Every invocation of this API re-seeds `catalog_cache` with banned topical grooming products. |
| `src/pages/api/admin/sync-catalog.ts` | 18 | `"Skincare Tools": ["gua sha rose quartz set", "jade roller face"]` — active Amazon scrape term | **REMOVE** this category entirely. Skincare Tools is an explicit banned category. Every sync re-injects products that must then be manually purged. This is a perpetual compliance liability. |

---

### 3.6 `faq.astro` — `Apple Care` Brand Reference
**Result: ⚠️ FLAG — HIGH RISK**

| File | Line | Flag Found | Recommended Fix |
|---|---|---|---|
| `src/pages/faq.astro` | 33 | `Apple Care eligible, Sony standard 1-year warranty` — brand-specific warranty claim in FAQ | This implies a direct partnership with Apple and Sony that does not exist. It also references Apple, a banned brand. Replace with: `"every product carries the full, standard manufacturer warranty, which remains fully intact regardless of purchase channel."` |

---

## Summary Scorecard

| Phase | Category | Status |
|---|---|---|
| 1.1 | FOMO / Urgency | ✅ CLEAN |
| 1.2 | Placeholder Text | ✅ CLEAN |
| 1.3 | Fake Social Proof | ❌ FLAG (CRITICAL) |
| 1.4 | Broken Links | ✅ CLEAN |
| 2.1 | Medical Items | ✅ CLEAN |
| 2.2 | Topicals (Skincare / Beard) | ❌ FLAG (CRITICAL — in sync API) |
| 2.3 | Weapons | ✅ CLEAN |
| 2.4 | Banned Brands | ❌ FLAG (CRITICAL — KitchenAid in testimonial; Apple in FAQ) |
| 2.5 | Raw Materials | ✅ CLEAN |
| 2.6 | Lexicon: "Hardware" | ❌ FLAG (SYSTEMIC — 35+ instances) |
| 2.6 | Lexicon: "Brand Partners" | ❌ FLAG (3 instances) |
| 3.1 | Shipping Times > 14 days | ✅ CLEAN |
| 3.2 | Dropshipping / 3PL Language | ⚠️ ADVISORY (1 instance — word in FAQ question) |
| 3.3 | Ghost Email: info@symeno.com | ✅ CLEAN |
| 3.4 | Non-Canonical Emails | ❌ FLAG (5 instances of contact@ and wholesale@) |
| 3.5 | Sync API Re-Contamination | ❌ FLAG (CRITICAL — perpetual re-seeding) |
| 3.6 | Apple Brand in FAQ | ❌ FLAG (HIGH) |

---

## Prioritized Remediation Checklist

### 🔴 P0 — CRITICAL (Block on submission)
1. **`sync-catalog.ts` L17–18:** Remove `"Men's Grooming"` and `"Skincare Tools"` categories entirely from `CATEGORY_QUERIES`.
2. **`Testimonials.astro` L8–33:** Remove the entire `fallbackReviews` array. Replace with an empty-state component ("Be the first to review").
3. **`Testimonials.astro` L12–13:** Remove hardcoded `KitchenAid` references from fallback data.
4. **`faq.astro` L33:** Remove `"Apple Care eligible, Sony standard 1-year warranty"`. Replace with generic warranty language.

### 🟠 P1 — HIGH (Must fix before submission)
5. **`faq.astro` L162 / `policies/shipping.astro` L31 / `policies/authenticity.astro` L63 / `emails/OrderReceipt.ts` L51:** Standardize all `contact@symeno.com` → `support@symeno.com`.
6. **`faq.astro` L20:** Rephrase FAQ question to remove the word "dropshipping" from visible page content.

### 🟡 P2 — MEDIUM (Fix before Tier-1 underwriting interview)
7. **`TrustBar.astro` L25, `Manifesto.astro` L49, `BrandStory.astro` L46–47:** Replace "brand partners" → "supply partners" or "verified distributors".
8. **Global "Hardware" Lexicon:** Systematically replace customer-facing instances of "hardware" with "lifestyle goods", "premium goods", or "products". Admin-panel occurrences are lower priority.

---

*Audit completed READ-ONLY. No source files were modified. All findings are based on static analysis of the codebase as of 2026-05-15.*
