<script lang="ts">
  import RichTextEditor from '../ui/RichTextEditor.svelte';

  let { initialData = null } = $props();

  // Core State (Mapped strictly to catalog_cache schema)
  let name = $state('');
  let slug = $state('');
  let brand = $state('');
  let category = $state('');
  let description = $state('');
  let price = $state(0.0);
  let in_stock = $state(1); // 1 = Active, 0 = Depleted

  // Status State
  let isSubmitting = $state(false);
  let errorMessage = $state('');

  // Reactive UI Telemetry
  let autoMsrp = $derived((price * 1.15).toFixed(2));
  let profitMargin = $derived(price > 0 ? '15.0' : '0.0');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    errorMessage = '';

    // Construct precise Edge Payload
    const payload = {
      name,
      slug,
      brand,
      category,
      price: Number(price),
      description,
      in_stock: Number(in_stock)
    };

    if (!name || !slug || !category || price <= 0) {
      errorMessage = "Incomplete telemetry. Name, Slug, Category, and Price > 0 are required.";
      isSubmitting = false;
      return;
    }

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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

<form onsubmit={handleSubmit} class="space-y-6">
  {#if errorMessage}
    <div
      class="animate-pulse rounded-md border border-brand-alert/30 bg-brand-alert/10 p-3 font-mono text-[10px] tracking-widest text-brand-alert uppercase shadow-sm"
    >
      Critical Exception: {errorMessage}
    </div>
  {/if}

  <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <div class="space-y-5 md:col-span-2">
      <div class="space-y-4 rounded-lg border border-outline bg-surface p-5 shadow-sm">
        <h3
          class="border-b border-outline pb-2 font-mono text-[10px] font-bold tracking-widest text-content uppercase"
        >
          Asset Designation
        </h3>

        <div class="space-y-1.5">
          <label class="font-mono text-[9px] tracking-widest text-content-muted uppercase">Product Name</label>
          <input
            type="text"
            bind:value={name}
            required
            class="w-full rounded-sm border border-outline bg-base px-3 py-2 text-xs text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand shadow-inner"
            placeholder="e.g. Premium Wireless Headphones"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="font-mono text-[9px] tracking-widest text-content-muted uppercase">URL Slug</label>
            <input
              type="text"
              bind:value={slug}
              required
              class="w-full rounded-sm border border-outline bg-base px-3 py-2 font-mono text-xs text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand shadow-inner"
              placeholder="premium-wireless-headphones"
            />
          </div>
          <div class="space-y-1.5">
            <label class="font-mono text-[9px] tracking-widest text-content-muted uppercase">Category</label>
            <input
              type="text"
              bind:value={category}
              required
              class="w-full rounded-sm border border-outline bg-base px-3 py-2 text-xs text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand shadow-inner"
              placeholder="Audio & Sound"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="font-mono text-[9px] tracking-widest text-content-muted uppercase">Brand Authority</label>
            <input
              type="text"
              bind:value={brand}
              class="w-full rounded-sm border border-outline bg-base px-3 py-2 text-xs text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand shadow-inner"
              placeholder="Symeno Originals"
            />
          </div>
          <div class="space-y-1.5">
            <label class="font-mono text-[9px] tracking-widest text-content-muted uppercase">Stock Status</label>
            <select
              bind:value={in_stock}
              class="w-full rounded-sm border border-outline bg-base px-3 py-2 font-mono text-xs text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand shadow-inner appearance-none"
            >
              <option value={1}>1 - Live & Active</option>
              <option value={0}>0 - Depleted</option>
            </select>
          </div>
        </div>
      </div>

      <div class="space-y-4 rounded-lg border border-outline bg-surface p-5 shadow-sm">
        <h3 class="border-b border-outline pb-2 font-mono text-[10px] font-bold tracking-widest text-content uppercase">
          Marketing Payload
        </h3>
        <div class="space-y-1.5">
          <label class="font-mono text-[9px] tracking-widest text-content-muted uppercase">Rich Text Description</label>
          <RichTextEditor
            bind:content={description}
            placeholder="Initialize product description matrix..."
          />
        </div>
      </div>
    </div>

    <div class="space-y-5">
      <div class="space-y-4 rounded-lg border border-outline bg-surface p-5 shadow-sm">
        <h3 class="border-b border-outline pb-2 font-mono text-[10px] font-bold tracking-widest text-content uppercase">
          Valuation
        </h3>

        <div class="space-y-1.5">
          <label class="font-mono text-[9px] tracking-widest text-content-muted uppercase">Base Price (USD)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-content-muted text-xs">$</span>
            <input
              type="number"
              bind:value={price}
              step="0.01"
              required
              class="w-full rounded-sm border border-outline bg-base py-2 pr-3 pl-6 font-mono text-xs text-brand font-bold transition-colors focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand shadow-inner"
            />
          </div>
        </div>

        <div class="space-y-3 border-t border-outline/50 pt-3">
          <div class="flex items-center justify-between">
            <span class="font-mono text-[9px] tracking-widest text-content-muted uppercase">UI MSRP Target</span>
            <span class="font-mono text-[10px] font-bold text-content-muted line-through">${autoMsrp}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-mono text-[9px] tracking-widest text-content-muted uppercase">Markup Yield</span>
            <span class="font-mono text-[10px] font-bold text-brand">+{profitMargin}%</span>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
        <p class="font-mono text-[9px] leading-relaxed tracking-widest text-amber-400/90 uppercase">
          System Notice: Edge ingestion immediately synchronizes this asset to the global catalog. Ensure schema integrity.
        </p>
      </div>
    </div>
  </div>

  <div class="flex justify-end gap-3 border-t border-outline pt-5">
    <a
      href="/admin/inventory"
      class="rounded-sm border border-outline bg-base px-5 py-2 font-mono text-[9px] font-bold tracking-widest text-content-muted uppercase transition-colors hover:border-brand/50 hover:text-content focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
    >Abort</a>
    <button
      type="submit"
      disabled={isSubmitting}
      class="rounded-sm bg-brand px-6 py-2 font-mono text-[9px] font-bold tracking-widest text-brand-dark uppercase shadow-[0_0_10px_rgba(54,244,164,0.1)] transition-all hover:bg-white hover:shadow-[0_0_15px_rgba(54,244,164,0.3)] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
    >
      {isSubmitting ? 'Uplinking...' : 'Inject Node'}
    </button>
  </div>
</form>