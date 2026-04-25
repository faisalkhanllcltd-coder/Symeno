<script lang="ts">
  import { productSchema, validatePayload } from '../../../lib/validations';
  import RichTextEditor from '../ui/RichTextEditor.svelte';

  // Core State
  let title = $state('');
  let slug = $state('');
  let brand = $state('');
  let sku = $state('');
  let description = $state('');
  let wholesale = $state(0.0);
  let retail = $state(0.0);
  let stock = $state(0);

  // Status State
  let isSubmitting = $state(false);
  let errorMessage = $state('');

  // Reactive Financial Telemetry
  let margin = $derived(
    retail > 0 ? (((retail - wholesale) / retail) * 100).toFixed(1) : '0.0'
  );
  let profit = $derived((retail - wholesale).toFixed(2));

  /**
   * Handles the secure injection of product data into the D1 database.
   * Performs client-side Zod validation before transmission.
   */
  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    errorMessage = '';

    // Construct Payload for Zod Validation
    const payload = {
      title,
      slug,
      brand,
      base_price: Number(wholesale),
      retail_price: Number(retail),
      description,
    };

    // 1. Execute Security Validation
    const validation = validatePayload(productSchema, payload);
    if (!validation.success) {
      errorMessage = validation.error;
      isSubmitting = false;
      return;
    }

    try {
      // 2. Transmit to Edge API
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...validation.data, sku, stock }),
      });

      if (res.ok) {
        window.location.href = '/admin/inventory';
      } else {
        const err = await res.json();
        errorMessage = err.error || 'D1 Injection Failed.';
      }
    } catch (e) {
      errorMessage = 'Network protocol error. Check database availability.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="space-y-8">
  {#if errorMessage}
    <div
      class="animate-pulse border border-brand-alert/30 bg-brand-alert/10 p-4 font-mono text-xs tracking-widest text-brand-alert uppercase"
    >
      Critical Error: {errorMessage}
    </div>
  {/if}

  <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
    <div class="space-y-6 md:col-span-2">
      <div class="space-y-5 border border-outline bg-surface p-6">
        <h3
          class="border-b border-outline pb-3 font-mono text-xs font-bold tracking-widest text-content uppercase"
        >
          Core Identity
        </h3>

        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >Product Title</label
          >
          <input
            type="text"
            bind:value={title}
            required
            class="w-full rounded-none border border-outline bg-base px-3 py-2 text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            placeholder="e.g. Sony WH-1000XM5"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >URL Slug</label
            >
            <input
              type="text"
              bind:value={slug}
              required
              class="w-full rounded-none border border-outline bg-base px-3 py-2 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              placeholder="sony-wh-1000xm5-black"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >Brand Authority</label
            >
            <input
              type="text"
              bind:value={brand}
              required
              class="w-full rounded-none border border-outline bg-base px-3 py-2 text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              placeholder="Sony"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >Master SKU</label
            >
            <input
              type="text"
              bind:value={sku}
              required
              class="w-full rounded-none border border-outline bg-base px-3 py-2 font-mono text-sm text-content uppercase transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              placeholder="SNY-XM5-BLK"
            />
          </div>
          <div class="space-y-1.5">
            <label
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >Initial Stock Level</label
            >
            <input
              type="number"
              bind:value={stock}
              required
              min="0"
              class="w-full rounded-none border border-outline bg-base px-3 py-2 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            />
          </div>
        </div>
      </div>

      <div class="space-y-5 border border-outline bg-surface p-6">
        <h3
          class="border-b border-outline pb-3 font-mono text-xs font-bold tracking-widest text-content uppercase"
        >
          Marketing Description
        </h3>
        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >Rich Content Canvas</label
          >
          <RichTextEditor
            bind:content={description}
            placeholder="Identify technical specifications and marketing hooks..."
          />
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="space-y-5 border border-outline bg-surface p-6">
        <h3
          class="border-b border-outline pb-3 font-mono text-xs font-bold tracking-widest text-content uppercase"
        >
          Financials
        </h3>

        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >Wholesale Cost (USD)</label
          >
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-content-muted"
              >$</span
            >
            <input
              type="number"
              bind:value={wholesale}
              step="0.01"
              required
              class="w-full rounded-none border border-outline bg-base py-2 pr-3 pl-7 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >Retail Price (USD)</label
          >
          <div class="relative">
            <span
              class="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-content-muted"
              >$</span
            >
            <input
              type="number"
              bind:value={retail}
              step="0.01"
              required
              class="w-full rounded-none border border-outline bg-base py-2 pr-3 pl-7 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            />
          </div>
        </div>

        <div class="space-y-3 border-t border-outline pt-4">
          <div class="flex items-center justify-between">
            <span
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >Gross Margin</span
            >
            <span
              class="font-mono font-bold {Number(margin) >= 20
                ? 'text-brand'
                : 'text-amber-400'}">{margin}%</span
            >
          </div>
          <div class="flex items-center justify-between">
            <span
              class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >Net Profit/Unit</span
            >
            <span class="font-mono font-bold text-content">${profit}</span>
          </div>
        </div>
      </div>

      <div class="border border-amber-500/20 bg-amber-500/5 p-4">
        <p
          class="font-mono text-[9px] leading-relaxed tracking-widest text-amber-400 uppercase"
        >
          Validation Warning: Ensure all descriptions are SEO-optimized. Changes
          to Master SKU will ripple through the entire fulfillment chain.
        </p>
      </div>
    </div>
  </div>

  <div class="flex justify-end gap-4 border-t border-outline pt-6">
    <a
      href="/admin/inventory"
      class="border border-transparent px-6 py-3 text-xs font-bold tracking-widest text-content-muted uppercase transition-colors hover:border-outline hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >Cancel</a
    >
    <button
      type="submit"
      disabled={isSubmitting}
      class="bg-brand px-8 py-3 text-xs font-bold tracking-widest text-black uppercase shadow-[0_0_15px_rgba(54,244,164,0.15)] transition-colors hover:bg-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      {isSubmitting ? 'Synchronizing D1...' : 'Inject to Matrix'}
    </button>
  </div>
</form>
