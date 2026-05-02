<script lang="ts">
  let { inventory = [] } = $props<{ inventory?: any[] }>();
  let lowStockThreshold = 5;
  let criticalItems = $derived(
    inventory
      .filter((i) => i.stock <= lowStockThreshold)
      .sort((a, b) => a.stock - b.stock)
  );
</script>

<div
  class="flex h-full flex-col overflow-hidden border border-brand-alert/30 bg-surface"
>
  <div class="border-b border-brand-alert/30 bg-brand-alert/10 p-4">
    <h3
      class="font-mono text-[10px] font-bold tracking-widest text-brand-alert uppercase"
    >
      Critical Low Stock Report
    </h3>
  </div>
  <div class="flex-1 overflow-y-auto">
    <ul class="divide-y divide-outline">
      {#each criticalItems as item}
        <li class="flex items-center justify-between p-4 hover:bg-white/[0.02]">
          <div>
            <div class="text-xs font-bold text-content">{item.product_title}</div>
            <div class="mt-1 font-mono text-[10px] text-content-muted">
              Slug: <span class="text-brand">{item.slug}</span>
            </div>
          </div>
          <div class="text-right">
            <span
              class="font-mono text-xs font-bold {item.stock === 0
                ? 'text-brand-alert'
                : 'text-amber-400'} border {item.stock === 0
                ? 'border-brand-alert/30 bg-brand-alert/10'
                : 'border-amber-500/30 bg-amber-500/10'} px-2 py-1"
            >
              {item.stock} Left
            </span>
          </div>
        </li>
      {:else}
        <li
          class="p-8 text-center text-[10px] font-mono text-content-muted uppercase"
        >
          All inventory levels above threshold.
        </li>
      {/each}
    </ul>
  </div>
</div>
