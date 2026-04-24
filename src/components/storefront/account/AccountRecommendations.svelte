<script lang="ts">
  let { products = [], title = 'Recommended for you' } = $props<{
    products?: any[];
    title?: string;
  }>();
</script>

{#if products.length > 0}
  <div class="mt-8 transition-colors duration-300">
    <h3
      class="mb-4 font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      {title}
    </h3>
    <div class="grid grid-cols-2 gap-4 md:grid-cols-3"> 
      {#each products as product}
        <a
          href={`/shop/product/${product.slug}`}        
          class="group block border border-outline bg-surface transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"   
        >
          <div class="relative aspect-square overflow-hidden bg-base">
            {#if product.image_url}
              <img
                src={product.image_url}
                alt={product.title}
                class="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            {:else}
              <div
                class="flex h-full w-full items-center justify-center text-content-muted opacity-50"
              >
                No Image
              </div>
            {/if}
          </div>
          <div class="border-t border-outline p-3">   
            <h4 class="truncate font-mono text-[10px] font-bold text-content">
              {product.title}
            </h4>
            <p class="mt-1 font-mono text-[10px] text-brand">
              ${product.base_price?.toFixed(2)}
            </p>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}
