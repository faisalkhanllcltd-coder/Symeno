<script lang="ts">
  let { products = [], title = "Recommended for you" } = $props<{ products: any[], title?: string }>();
</script>

{#if products.length > 0}
  <div class="mt-8">
    <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono mb-4">{title}</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      {#each products as product}
        <a href={`/shop/product/${product.slug}`} class="group bg-[#111318] border border-white/10 hover:border-[#36f4a4]/50 transition-colors block">
          <div class="aspect-square bg-[#0a0b0e] relative overflow-hidden">
            {#if product.image_url}
              <img src={product.image_url} alt={product.title} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-white/10">No Image</div>
            {/if}
          </div>
          <div class="p-3 border-t border-white/10">
            <h4 class="text-[10px] font-bold text-white font-mono truncate">{product.title}</h4>
            <p class="text-[10px] text-[#36f4a4] font-mono mt-1">${product.base_price?.toFixed(2)}</p>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}