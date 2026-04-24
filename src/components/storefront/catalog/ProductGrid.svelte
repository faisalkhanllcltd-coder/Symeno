<script lang="ts">
  let { products = [] } = $props<{ products: any[] }>();
</script>

{#if products.length === 0}
  <div
    class="flex min-h-[400px] flex-col items-center justify-center border border-outline bg-surface p-12 text-center transition-colors"
  >
    <div
      class="mb-4 flex h-12 w-12 items-center justify-center border border-outline opacity-50"
    >
      <span class="font-mono text-[10px] tracking-widest text-content uppercase"
        >NULL</span
      >
    </div>
    <h3
      class="mb-2 font-mono text-sm font-bold tracking-widest text-content uppercase"
    >
      No Hardware Acquired
    </h3>
    <p class="mx-auto max-w-sm font-mono text-[10px] text-content-muted">
      Your exact query yielded zero results in the current D1 database snapshot.
    </p>
  </div>
{:else}
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each products as product}
      <a
        href={`/shop/product/${product.slug}`}
        class="group relative flex h-full flex-col overflow-hidden border border-outline bg-surface transition-colors hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        ></div>

        <div
          class="relative flex aspect-square items-center justify-center border-b border-outline bg-base transition-colors" 
        >
          <span
            class="font-mono text-[10px] tracking-widest text-content-muted/50 uppercase"
            >Image Matrix</span
          >

          {#if product.retail_price > product.base_price}
            <div
              class="bg-brand-alert absolute top-4 right-4 z-10 px-2 py-1 text-[9px] font-bold tracking-widest text-black uppercase"
            >
              Deal
            </div>
          {/if}
        </div>

        <div class="flex flex-grow flex-col p-5">
          <span
            class="mb-2 block font-mono text-[9px] tracking-widest text-content-muted uppercase"
            >{product.brand}</span
          >
          <h3
            class="mb-4 line-clamp-2 text-sm leading-snug font-bold text-content transition-colors group-hover:text-brand"
          >
            {product.title}
          </h3>

          <div class="mt-auto flex items-end justify-between">
            <div>
              <span class="block font-mono text-lg font-bold text-content transition-colors group-hover:text-brand"
                >${product.base_price.toFixed(2)}</span 
              >
              {#if product.retail_price > product.base_price}
                <span class="font-mono text-[10px] text-content-muted line-through"
                  >MSRP: ${product.retail_price.toFixed(2)}</span
                >
              {/if}
            </div>

            <button
              class="flex h-8 w-8 items-center justify-center border border-outline text-content-muted transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              aria-label="Quick Add"
              onclick={(e) => e.preventDefault()}
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}