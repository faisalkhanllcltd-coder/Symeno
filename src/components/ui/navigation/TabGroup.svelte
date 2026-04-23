<script lang="ts">
  export let tabs: string[] = [];
  export let activeTab: string = tabs[0];
  
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  function selectTab(tab: string) {
    activeTab = tab;
    dispatch('change', { tab });
  }
</script>

<div class="border-b border-gray-200 flex space-x-6 no-scrollbar overflow-x-auto">
  {#each tabs as tab}
    <button 
      on:click={() => selectTab(tab)}
      class="py-3 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 whitespace-nowrap focus:outline-none {activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}"
    >
      {tab}
    </button>
  {/each}
</div>
