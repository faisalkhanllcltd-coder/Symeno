<script lang="ts">
  import { recentStore } from '../../../stores/recentlyViewed.svelte';
  
  // Exclude current product if we are on a product page
  let { currentProductId = '' } = $props<{ currentProductId?: string }>();
  
  let displayItems = $derived(recentStore.items.filter(i => i.id !== currentProductId).slice(0, 4));
</script>

{#if displayItems.length > 0}
  <section class="py-16 border-t border-white/10">
    <div class="max-w-7xl mx-auto px-6">
      <h2 class="text-xs font-bold uppercase tracking-widest text-white/50 font-mono mb-8">Recently Analyzed Data</h2>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        {#each displayItems as item}
          <a href={`/shop/product/${item.slug}`} class="group bg-[#111318] border border-white/10 hover:border-[#36f4a4]/50 transition-colors block">
            <div class="aspect-square bg-[#0a0b0e] relative overflow-hidden">
              <img src={item.image_url || '/placeholder.png'} alt={item.title} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            </div>
            <div class="p-4 border-t border-white/10">
              <h4 class="text-[10px] font-bold text-white font-mono truncate">{item.title}</h4>
              <p class="text-[10px] text-[#36f4a4] font-mono mt-1">${item.price.toFixed(2)}</p>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}