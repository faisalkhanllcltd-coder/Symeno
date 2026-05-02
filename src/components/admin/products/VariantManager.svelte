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
      slug: '',
      title: '',
      priceAdjustment: 0,
      inventoryQuantity: 0,
    });
  }

  function removeVariant(id: string) {
    variants = variants.filter((v) => v.id !== id);
  }
</script>

<div class="space-y-4">
  <div
    class="border-outline flex items-center justify-between border-b pb-2 transition-colors duration-300"
  >
    <h3
      class="text-content font-mono text-sm font-bold tracking-widest uppercase transition-colors duration-300"
    >
      Product Variants
    </h3>
    <button
      type="button"
      onclick={addVariant}
      class="text-brand text-xs font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
    >
      + Add Variant
    </button>
  </div>

  {#if variants.length === 0}
    <p
      class="text-content-muted font-mono text-xs transition-colors duration-300"
    >
      No variants configured. Product acts as a single SKU.
    </p>
  {/if}

  <div class="space-y-3">
    {#each variants as variant (variant.id)}
      <div
        class="bg-surface border-outline grid grid-cols-12 items-center gap-3 rounded border p-3 transition-colors duration-300"
      >
        <div class="col-span-4">
          <label for={`slug-${variant.id}`} class="sr-only">Slug</label>
          <input
            id={`slug-${variant.id}`}
            type="text"
            bind:value={variant.slug}
            placeholder="Slug (e.g. SNY-XM5-BLK)"
            class="border-outline bg-base text-content placeholder-content-muted focus:border-brand focus:ring-brand block w-full rounded-md border px-3 py-2 font-mono text-xs transition-colors duration-300 focus:ring-1 focus:outline-none"
          />
        </div>

        <div class="col-span-3">
          <label for={`title-${variant.id}`} class="sr-only">Title</label>
          <input
            id={`title-${variant.id}`}
            type="text"
            bind:value={variant.title}
            placeholder="Variant Title"
            class="border-outline bg-base text-content placeholder-content-muted focus:border-brand focus:ring-brand block w-full rounded-md border px-3 py-2 font-mono text-xs transition-colors duration-300 focus:ring-1 focus:outline-none"
          />
        </div>

        <div class="relative col-span-2">
          <label for={`price-${variant.id}`} class="sr-only">Price Adj</label>
          <span class="text-content-muted absolute top-2 left-3 text-xs">$</span
          >
          <input
            id={`price-${variant.id}`}
            type="number"
            bind:value={variant.priceAdjustment}
            step="0.01"
            placeholder="0.00"
            class="border-outline bg-base text-content placeholder-content-muted focus:border-brand focus:ring-brand block w-full rounded-md border py-2 pr-3 pl-6 font-mono text-xs transition-colors duration-300 focus:ring-1 focus:outline-none"
          />
        </div>

        <div class="col-span-2">
          <label for={`qty-${variant.id}`} class="sr-only">Stock</label>
          <input
            id={`qty-${variant.id}`}
            type="number"
            bind:value={variant.inventoryQuantity}
            placeholder="Qty"
            class="border-outline bg-base text-content placeholder-content-muted focus:border-brand focus:ring-brand block w-full rounded-md border px-3 py-2 font-mono text-xs transition-colors duration-300 focus:ring-1 focus:outline-none"
          />
        </div>

        <div class="col-span-1 text-right">
          <button
            type="button"
            aria-label="Remove Variant"
            onclick={() => removeVariant(variant.id)}
            class="text-brand-alert p-2 transition-opacity hover:opacity-80"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              /></svg
            >
          </button>
        </div>

        <input type="hidden" name="variant_id[]" value={variant.id} />
        <input type="hidden" name="variant_slug[]" value={variant.slug} />
        <input type="hidden" name="variant_title[]" value={variant.title} />
        <input
          type="hidden"
          name="variant_price[]"
          value={variant.priceAdjustment}
        />
        <input
          type="hidden"
          name="variant_qty[]"
          value={variant.inventoryQuantity}
        />
      </div>
    {/each}
  </div>
</div>
