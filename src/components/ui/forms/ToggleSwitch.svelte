<script lang="ts">
  export let checked: boolean = false;
  export let label: string = "";
  export let id: string = Math.random().toString(36).substring(2, 9);
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function toggle() {
    checked = !checked;
    dispatch('change', { checked });
  }
</script>

<label for={id} class="flex items-center cursor-pointer group">
  <div class="relative">
    <input type="checkbox" {id} class="sr-only" bind:checked on:change={toggle} />
    <div class="block w-10 h-5 bg-[#1A1D23] border border-white/20 transition-colors {checked ? 'bg-[#36f4a4]/20 border-[#36f4a4]' : ''}"></div>
    <div class="dot absolute left-1 top-1 bg-white/60 w-3 h-3 transition-transform duration-200 ease-in-out {checked ? 'transform translate-x-5 bg-[#36f4a4]' : ''}"></div>
  </div>
  {#if label}
    <div class="ml-3 text-[10px] font-mono uppercase tracking-widest {checked ? 'text-white' : 'text-white/50'} transition-colors">
      {label}
    </div>
  {/if}
</label>
