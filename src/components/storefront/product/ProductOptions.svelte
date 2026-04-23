<script lang="ts">
  export let variants: { id: string, name: string, available: boolean }[] = [];
  export let selectedId: string = "";
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function selectVariant(id: string, available: boolean) {
    if (!available) return;
    selectedId = id;
    dispatch('change', { id });
  }
</script>

<div class="space-y-3">
  <div class="flex justify-between items-center">
    <span class="text-[10px] font-mono uppercase tracking-widest text-gray-500">Configuration</span>
    <button class="text-[10px] font-mono text-black underline decoration-gray-300 hover:decoration-black transition-colors focus:outline-none">Size Guide</button>
  </div>
  
  <div class="grid grid-cols-3 gap-3">
    {#each variants as variant}
      <button 
        type="button"
        on:click={() => selectVariant(variant.id, variant.available)}
        class="py-3 text-xs font-bold uppercase tracking-widest border transition-colors focus:outline-none 
          {!variant.available ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed line-through' : 
            selectedId === variant.id ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-900 hover:border-black'}"
        disabled={!variant.available}
      >
        {variant.name}
      </button>
    {/each}
  </div>
</div>
