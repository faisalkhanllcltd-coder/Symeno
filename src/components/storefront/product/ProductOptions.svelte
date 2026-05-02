<script lang="ts">
  interface Variant {
    id: string;
    name: string;
    value: string;
    inStock: boolean;
  }

  interface OptionGroup {
    name: string;
    values: Variant[];
  }

  let { 
    options = [], 
    basePrice,
    stockStatus,
    onVariantChange 
  } = $props<{
    options: OptionGroup[];
    basePrice: number;
    stockStatus: number;
    onVariantChange?: (selectedOptions: Record<string, string>) => void;
  }>();

  // Track the selected value for each option group (e.g., { Color: 'Black', Size: 'Large' })
  let selected = $state<Record<string, string>>({});

  // Initialize defaults
  $effect(() => {
    if (Object.keys(selected).length === 0 && options.length > 0) {
      const defaults: Record<string, string> = {};
      options.forEach(opt => {
        const available = opt.values.find(v => v.inStock);
        if (available) defaults[opt.name] = available.value;
      });
      selected = defaults;
      if (onVariantChange) onVariantChange(selected);
    }
  });

  function handleSelect(groupName: string, value: string) {
    selected[groupName] = value;
    if (onVariantChange) onVariantChange(selected);
  }

  // Derive if the current selection combination is actually purchasable
  let isPurchasable = $derived(stockStatus > 0);
</script>

<div class="space-y-6">
  <div class="flex items-end justify-between border-b border-outline pb-4">
    <div>
      <p class="text-content-muted font-mono text-[10px] tracking-widest uppercase">Current Price</p>
      <p class="text-brand font-mono text-2xl font-bold">${basePrice.toFixed(2)}</p>
    </div>
    {#if isPurchasable}
      <span class="bg-brand/10 text-brand border-brand/20 rounded border px-2 py-1 font-mono text-[10px] font-bold tracking-widest uppercase">In Stock</span>
    {:else}
      <span class="bg-brand-alert/10 text-brand-alert border-brand-alert/20 rounded border px-2 py-1 font-mono text-[10px] font-bold tracking-widest uppercase">Out of Stock</span>
    {/if}
  </div>

  {#each options as group}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="text-content font-mono text-xs font-bold tracking-widest uppercase">{group.name}</h4>
        <span class="text-content-muted font-mono text-[10px] uppercase">{selected[group.name] || 'Select'}</span>
      </div>
      
      <div class="flex flex-wrap gap-2">
        {#each group.values as variant}
          <button
            onclick={() => handleSelect(group.name, variant.value)}
            disabled={!variant.inStock}
            class="min-w-[48px] rounded-md border px-4 py-2 font-mono text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-40
            {selected[group.name] === variant.value 
              ? 'border-brand bg-brand/10 text-brand' 
              : 'border-outline bg-surface text-content hover:border-content-muted'}"
          >
            {variant.value}
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>
