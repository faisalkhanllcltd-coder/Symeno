<script lang="ts">
  import { cart } from '../../../stores/cart.svelte.ts';

  let { products = [] } = $props<{ products: any[] }>();

  // Secure Cart Injection utilizing Claude Schema
  function handleAddToCart(e: Event, product: any) {
    e.preventDefault();
    e.stopPropagation();

    cart.addItem({
      id: product.id || product.slug,
      name: product.name || product.title,
      price: Number(product.price || product.base_price || 0),
      image: product.image_url || '/images/system/fallback.webp'
    }, 1);
  }
</script>

{#if products.length === 0}
  <div class="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-outline bg-surface p-10 text-center transition-colors">
    <div class="mb-3 flex h-10 w-10 items-center justify-center rounded-sm border border-outline opacity-50">
      <span class="font-mono text-[9px] tracking-widest text-content uppercase">NULL</span>
    </div>
    <h3 class="mb-1 font-mono text-xs font-bold tracking-widest text-content uppercase">No Hardware Acquired</h3>
    <p class="mx-auto max-w-xs font-mono text-[9px] text-content-muted">Your exact query yielded zero results in the current network snapshot.</p>
  </div>
{:else}
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {#each products as product}
      <div class="group relative flex h-full flex-col rounded-lg border border-outline bg-surface shadow-sm transition-all hover:border-brand/50 hover:shadow-md focus-within:ring-1 focus-within:ring-brand">
        
        <a
          href={`/shop/product/${product.slug}`}
          class="absolute inset-0 z-10"
          aria-label={`View ${product.name || product.title}`}
        ></a>

        <div class="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-t from-brand/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

        <div class="relative flex aspect-[4/5] items-center justify-center border-b border-outline/50 bg-base/50 transition-colors rounded-t-lg overflow-hidden p-2">
          {#if product.image_url}
            <img
              src={product.image_url}
              alt={product.name || product.title}
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          {:else}
            <span class="font-mono text-[9px] tracking-widest text-content-muted/50 uppercase">Visual Missing</span>
          {/if}

          {#if Number(product.retail_price) > Number(product.price || product.base_price)}
            <div class="bg-brand/10 border border-brand/20 absolute top-3 right-3 z-20 rounded-sm px-1.5 py-0.5 text-[8px] font-bold tracking-widest text-brand uppercase backdrop-blur-md">
              Save ${Math.floor(Number(product.retail_price) - Number(product.price || product.base_price))}
            </div>
          {/if}
        </div>

        <div class="flex flex-grow flex-col p-4 bg-surface relative z-20 pointer-events-none rounded-b-lg">
          <span class="mb-1.5 block font-mono text-[9px] tracking-widest text-content-muted uppercase">{product.brand}</span>
          <h3 class="mb-3 line-clamp-2 text-xs leading-snug font-bold text-content transition-colors group-hover:text-brand">{product.name || product.title}</h3>

          <div class="mt-auto flex items-end justify-between pointer-events-auto border-t border-outline/30 pt-3">
            <div>
              <span class="block font-mono text-base font-bold text-content transition-colors group-hover:text-brand">
                ${Number(product.price || product.base_price || 0).toFixed(2)}
              </span>
              {#if Number(product.retail_price) > Number(product.price || product.base_price)}
                <span class="font-mono text-[9px] text-content-muted line-through">
                  MSRP: ${Number(product.retail_price || 0).toFixed(2)}
                </span>
              {/if}
            </div>

            <button
              class="relative z-30 flex h-7 w-7 items-center justify-center rounded-sm border border-outline bg-base text-content-muted transition-all hover:border-brand hover:bg-brand hover:text-brand-dark focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
              aria-label="Quick Add"
              onclick={(e) => handleAddToCart(e, product)}
            >
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}