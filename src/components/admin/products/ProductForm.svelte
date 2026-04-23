<script lang="ts">
  import { productSchema, validatePayload } from '../../../lib/validations';
  import RichTextEditor from '../ui/RichTextEditor.svelte';

  // Core State
  let title = $state('');
  let slug = $state('');
  let brand = $state('');
  let sku = $state('');
  let description = $state('');
  let wholesale = $state(0.00);
  let retail = $state(0.00);
  let stock = $state(0);

  // Status State
  let isSubmitting = $state(false);
  let errorMessage = $state('');

  // Reactive Financial Telemetry
  let margin = $derived(retail > 0 ? (((retail - wholesale) / retail) * 100).toFixed(1) : "0.0");
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
      description
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
        body: JSON.stringify({ ...validation.data, sku, stock })
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
    <div class="bg-rose-500/10 border border-rose-500/30 p-4 text-rose-400 text-xs font-mono uppercase tracking-widest animate-pulse">
      Critical Error: {errorMessage}
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    
    <div class="md:col-span-2 space-y-6">
      
      <div class="bg-[#111318] border border-white/10 p-6 space-y-5">
        <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-3">Core Identity</h3>
        
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Product Title</label>
          <input type="text" bind:value={title} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 rounded-none transition-colors" placeholder="e.g. Sony WH-1000XM5" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">URL Slug</label>
            <input type="text" bind:value={slug} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 rounded-none transition-colors font-mono" placeholder="sony-wh-1000xm5-black" />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Brand Authority</label>
            <input type="text" bind:value={brand} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 rounded-none transition-colors" placeholder="Sony" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Master SKU</label>
            <input type="text" bind:value={sku} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 rounded-none transition-colors font-mono uppercase" placeholder="SNY-XM5-BLK" />
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Initial Stock Level</label>
            <input type="number" bind:value={stock} required min="0" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 rounded-none transition-colors font-mono" />
          </div>
        </div>
      </div>

      <div class="bg-[#111318] border border-white/10 p-6 space-y-5">
        <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-3">Marketing Description</h3>
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Rich Content Canvas</label>
          <RichTextEditor bind:content={description} placeholder="Identify technical specifications and marketing hooks..." />
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-[#111318] border border-white/10 p-6 space-y-5">
        <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-3">Financials</h3>
        
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Wholesale Cost (USD)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40 font-mono">$</span>
            <input type="number" bind:value={wholesale} step="0.01" required class="w-full bg-[#1A1D23] border border-white/10 text-white pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 rounded-none transition-colors font-mono" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Retail Price (USD)</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-white/40 font-mono">$</span>
            <input type="number" bind:value={retail} step="0.01" required class="w-full bg-[#1A1D23] border border-white/10 text-white pl-7 pr-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 rounded-none transition-colors font-mono" />
          </div>
        </div>

        <div class="pt-4 border-t border-white/10 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Gross Margin</span>
            <span class="font-mono font-bold {Number(margin) >= 20 ? 'text-[#36f4a4]' : 'text-amber-400'}">{margin}%</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Net Profit/Unit</span>
            <span class="font-mono font-bold text-white">${profit}</span>
          </div>
        </div>
      </div>

      <div class="bg-amber-500/5 border border-amber-500/20 p-4">
        <p class="text-[9px] font-mono text-amber-400 uppercase tracking-widest leading-relaxed">
          Validation Warning: Ensure all descriptions are SEO-optimized. Changes to Master SKU will ripple through the entire fulfillment chain.
        </p>
      </div>
    </div>
  </div>

  <div class="flex justify-end gap-4 border-t border-white/10 pt-6">
    <a href="/admin/inventory" class="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors border border-transparent hover:border-white/20">Cancel</a>
    <button 
      type="submit" 
      disabled={isSubmitting}
      class="bg-[#36f4a4] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(54,244,164,0.15)] disabled:opacity-50"
    >
      {isSubmitting ? 'Synchronizing D1...' : 'Inject to Matrix'}
    </button>
  </div>
</form>