<script lang="ts">
  let {
    tabs = [],
    activeTab = $bindable(),
    onchange
  } = $props<{
    tabs?: string[];
    activeTab?: string;
    onchange?: (tab: string) => void;
  }>();

  // Initialize active tab safely
  if (!activeTab && tabs.length > 0) {
    activeTab = tabs[0];
  }

  function selectTab(tab: string) {
    activeTab = tab;
    if (onchange) onchange(tab);
  }
</script>

<div
  class="no-scrollbar flex space-x-6 overflow-x-auto border-b border-outline"
>
  {#each tabs as tab}
    <button
      onclick={() => selectTab(tab)}
      class="border-b-2 py-3 text-xs font-bold tracking-widest whitespace-nowrap uppercase transition-colors focus-visible:outline-none focus-visible:text-brand {activeTab ===
      tab
        ? 'border-brand text-brand'
        : 'border-transparent text-content-muted hover:text-content hover:border-outline'}"
    >
      {tab}
    </button>
  {/each}
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
