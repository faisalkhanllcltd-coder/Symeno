<script lang="ts">
  import type { ProductVariant } from '../../../types/storefront';

  interface Props {
    initialVariants?: ProductVariant[];
  }

  let { initialVariants = [] }: Props = $props();
  
  // svelte-ignore state_referenced_locally
  let variants = $state<ProductVariant[]>([...initialVariants]);

  function addVariant() {
    variants.push({
      id: crypto.randomUUID(),
      productId: '', 
      sku: '',
      title: '',
      priceAdjustment: 0,
      inventoryQuantity: 0
    });
  }

  function removeVariant(id: string) {
    variants = variants.filter(v => v.id !== id);
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between border-b border-outline pb-2 transition-colors duration-300">
    <h3 class="text-sm font-bold uppercase tracking-widest text-content font-mono transition-colors duration-300">Product Variants</h3>
    <button type="button" onclick={addVariant} class="text-xs font-bold text-brand hover:opacity-80 transition-opacity uppercase tracking-widest">
      + Add Variant
    </button>
  </div>

  {#if variants.length === 0}
    <p class="text-xs text-content-muted font-mono transition-colors duration-300">No variants configured. Product acts as a single SKU.</p>
  {/if}

  <div class="space-y-3">
    {#each variants as variant (variant.id)}
      <div class="grid grid-cols-12 gap-3 items-center bg-surface p-3 rounded border border-outline transition-colors duration-300">
        
        <div class="col-span-4">
          <label for={`sku-${variant.id}`} class="sr-only">SKU</label>
          <input id={`sku-${variant.id}`} type="text" bind:value={variant.sku} placeholder="SKU (e.g. SNY-XM5-BLK)" class="block w-full rounded-md border border-outline bg-base px-3 py-2 text-xs text-content placeholder-content-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-mono transition-colors duration-300" />
        </div>
        
        <div class="col-span-3">
          <label for={`title-${variant.id}`} class="sr-only">Title</label>
          <input id={`title-${variant.id}`} type="text" bind:value={variant.title} placeholder="Variant Title" class="block w-full rounded-md border border-outline bg-base px-3 py-2 text-xs text-content placeholder-content-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-mono transition-colors duration-300" />
        </div>

        <div class="col-span-2 relative">
          <label for={`price-${variant.id}`} class="sr-only">Price Adj</label>
          <span class="absolute left-3 top-2 text-content-muted text-xs">$</span>
          <input id={`price-${variant.id}`} type="number" bind:value={variant.priceAdjustment} step="0.01" placeholder="0.00" class="block w-full rounded-md border border-outline bg-base pl-6 pr-3 py-2 text-xs text-content placeholder-content-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-mono transition-colors duration-300" />
        </div>

        <div class="col-span-2">
          <label for={`qty-${variant.id}`} class="sr-only">Stock</label>
          <input id={`qty-${variant.id}`} type="number" bind:value={variant.inventoryQuantity} placeholder="Qty" class="block w-full rounded-md border border-outline bg-base px-3 py-2 text-xs text-content placeholder-content-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-mono transition-colors duration-300" />
        </div>

        <div class="col-span-1 text-right">
          <button type="button" aria-label="Remove Variant" onclick={() => removeVariant(variant.id)} class="text-brand-alert hover:opacity-80 transition-opacity p-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <input type="hidden" name="variant_id[]" value={variant.id} />
        <input type="hidden" name="variant_sku[]" value={variant.sku} />
        <input type="hidden" name="variant_title[]" value={variant.title} />
        <input type="hidden" name="variant_price[]" value={variant.priceAdjustment} />
        <input type="hidden" name="variant_qty[]" value={variant.inventoryQuantity} />
      </div>
    {/each}
  </div>
</div>