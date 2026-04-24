<script lang="ts">
  let {
    label = 'Actions',
    options = [],
    onselect
  } = $props<{
    label?: string;
    options?: { label: string; action: string }[];
    onselect?: (action: string) => void;
  }>();

  let isOpen = $state(false);

  function triggerAction(action: string) {
    isOpen = false;
    if (onselect) onselect(action);
  }
</script>

<div class="relative inline-block text-left">
  <button
    onclick={() => (isOpen = !isOpen)}
    class="flex items-center gap-2 bg-surface border border-outline px-4 py-2 text-[10px] font-bold tracking-widest text-content uppercase transition-colors hover:bg-base hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
  >
    {label}
    <svg
      class="h-3 w-3 transition-transform duration-300 {isOpen ? 'rotate-180 text-brand' : 'text-content-muted'}"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      /></svg
    >
  </button>

  {#if isOpen}
    <div
      class="absolute right-0 z-50 mt-2 w-48 origin-top-right border border-outline bg-surface shadow-2xl"        
    >
      <div class="py-1">
        {#each options as option}
          <button
            onclick={() => triggerAction(option.action)}
            class="w-full px-4 py-2 text-left font-mono text-xs text-content transition-colors hover:bg-base hover:text-brand focus-visible:outline-none focus-visible:bg-base focus-visible:text-brand"
          >
            {option.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
