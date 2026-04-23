<script lang="ts">
  export let label: string = "Actions";
  export let options: { label: string, action: string }[] = [];
  
  let isOpen = false;
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function triggerAction(action: string) {
    isOpen = false;
    dispatch('select', { action });
  }
</script>

<div class="relative inline-block text-left">
  <button on:click={() => isOpen = !isOpen} class="bg-black text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 focus:outline-none hover:bg-gray-800 transition-colors">
    {label}
    <svg class="w-3 h-3 transition-transform {isOpen ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
  </button>
  
  {#if isOpen}
    <div class="origin-top-right absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl z-50">
      <div class="py-1">
        {#each options as option}
          <button on:click={() => triggerAction(option.action)} class="w-full text-left px-4 py-2 text-xs font-mono hover:bg-gray-50 text-gray-700 transition-colors focus:outline-none">
            {option.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
