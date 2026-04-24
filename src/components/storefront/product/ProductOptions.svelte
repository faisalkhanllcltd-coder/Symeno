<script lang="ts">
  let {
    variants = [],
    selectedId = '',
    onchange,
  } = $props<{
    variants?: { id: string; name: string; available: boolean }[];
    selectedId?: string;
    onchange?: (id: string) => void;
  }>();

  function selectVariant(id: string, available: boolean) {
    if (!available) return;
    if (onchange) onchange(id);
  }
</script>

<div class="space-y-3">
  <div class="flex items-center justify-between">       
    <span class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
      >Configuration</span
    >
    <button
      class="font-mono text-[10px] text-content underline decoration-outline transition-colors hover:decoration-content focus-visible:outline-none focus-visible:text-brand"
      >Size Guide</button
    >
  </div>

  <div class="grid grid-cols-3 gap-3">
    {#each variants as variant}
      <button
        type="button"
        onclick={() => selectVariant(variant.id, variant.available)}
        class="border py-3 text-xs font-bold tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand     
          {!variant.available
          ? 'cursor-not-allowed border-outline bg-surface text-content-muted line-through opacity-50'
          : selectedId === variant.id
            ? 'border-brand bg-brand text-brand-dark'        
            : 'border-outline bg-base text-content hover:border-brand'}"
        disabled={!variant.available}
      >
        {variant.name}
      </button>
    {/each}
  </div>
</div>
