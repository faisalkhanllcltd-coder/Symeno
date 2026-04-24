<script lang="ts">
  import { recentStore } from '../../../stores/recentlyViewed.svelte';

  // Exclude current product if we are on a product page
  let { currentProductId = '' } = $props<{ currentProductId?: string }>();

  let displayItems = $derived(
    recentStore.items.filter((i) => i.id !== currentProductId).slice(0, 4)
  );
</script>

{#if displayItems.length > 0}
  <section class="border-t border-white/10 py-16">
    <div class="mx-auto max-w-7xl px-6">
      <h2
        class="mb-8 font-mono text-xs font-bold tracking-widest text-white/50 uppercase"
      >
        Recently Analyzed Data
      </h2>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        {#each displayItems as item}
          <a
            href={`/shop/product/${item.slug}`}
            class="group block border border-white/10 bg-[#111318] transition-colors hover:border-[#36f4a4]/50"
          >
            <div class="relative aspect-square overflow-hidden bg-[#0a0b0e]">
              <img
                src={item.image_url || '/placeholder.png'}
                alt={item.title}
                class="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
              />
            </div>
            <div class="border-t border-white/10 p-4">
              <h4 class="truncate font-mono text-[10px] font-bold text-white">
                {item.title}
              </h4>
              <p class="mt-1 font-mono text-[10px] text-[#36f4a4]">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}
