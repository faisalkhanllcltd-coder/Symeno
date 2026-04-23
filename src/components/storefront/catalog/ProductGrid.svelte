<script lang="ts">
  let { products = [] } = $props<{ products: any[] }>();
</script>

{#if products.length === 0}
  <div class="bg-[#111318] border border-white/10 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
    <div class="w-12 h-12 border border-white/10 flex items-center justify-center mb-4 opacity-50">
      <span class="text-[10px] font-mono text-white uppercase tracking-widest">NULL</span>
    </div>
    <h3 class="text-sm font-bold text-white uppercase tracking-widest font-mono mb-2">No Hardware Acquired</h3>
    <p class="text-[10px] font-mono text-white/50 max-w-sm mx-auto">Your exact query yielded zero results in the current D1 database snapshot.</p>
  </div>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each products as product}
      <a href={`/shop/product/${product.slug}`} class="group bg-[#111318] border border-white/10 hover:border-[#36f4a4]/50 transition-colors flex flex-col h-full relative overflow-hidden">
        
        <div class="absolute inset-0 bg-gradient-to-t from-[#36f4a4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        
        <div class="aspect-square bg-[#1A1D23] border-b border-white/10 flex items-center justify-center relative">
          <span class="text-[10px] font-mono text-white/20 uppercase tracking-widest">Image Matrix</span>
          
          {#if product.retail_price > product.base_price}
            <div class="absolute top-4 right-4 bg-brand-alert text-black px-2 py-1 text-[9px] font-bold uppercase tracking-widest z-10">
              Deal
            </div>
          {/if}
        </div>

        <div class="p-5 flex flex-col flex-grow">
          <span class="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-2 block">{product.brand}</span>
          <h3 class="text-sm font-bold text-white group-hover:text-[#36f4a4] transition-colors leading-snug mb-4 line-clamp-2">{product.title}</h3>
          
          <div class="mt-auto flex items-end justify-between">
            <div>
              <span class="text-lg font-mono font-bold text-white block">${product.base_price.toFixed(2)}</span>
              {#if product.retail_price > product.base_price}
                <span class="text-[10px] font-mono text-white/40 line-through">MSRP: ${product.retail_price.toFixed(2)}</span>
              {/if}
            </div>
            
            <button class="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:bg-[#36f4a4] group-hover:text-black group-hover:border-[#36f4a4] transition-all text-white/50" aria-label="Quick Add">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>
      </a>
    {/each}
  </div>
{/if}