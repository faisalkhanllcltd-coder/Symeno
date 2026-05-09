<script lang="ts">
  import { recentStore } from '../../../stores/recentlyViewed.svelte.ts';

  // Exclude current product if we are on a product page
  let { currentProductId = '' } = $props<{ currentProductId?: string }>();

  let displayItems = $derived(
    recentStore.items.filter((i) => i.id !== currentProductId).slice(0, 4)
  );
</script>

{#if displayItems.length > 0}
  <section class="border-t border-outline py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2
        class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >
        Recently Analyzed Data
      </h2>

      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        {#each displayItems as item}
          <div
            class="group relative block rounded-lg border border-outline bg-surface shadow-sm transition-colors hover:border-brand/50 focus-within:outline-none focus-within:ring-1 focus-within:ring-brand overflow-hidden"
          >
            <a
              href={`/shop/product/${item.slug}`}
              class="absolute inset-0 z-10"
              aria-label={`View ${item.name}`}
            ></a>

            <div class="relative aspect-square overflow-hidden bg-base/50 border-b border-outline/50">
              <img
                src={item.image_url || '/images/system/fallback.webp'}
                alt={item.name}
                class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
              />
            </div>
            <div class="p-3 relative z-0 flex flex-col justify-between">
              <h4 class="truncate font-mono text-[9px] font-bold text-content transition-colors group-hover:text-brand">
                {item.name}
              </h4>
              <p class="mt-1 font-mono text-[10px] font-bold text-brand">
                ${(item.price || 0).toFixed(2)}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
{/if}