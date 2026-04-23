<script lang="ts">
  let isVisible = $state(true);
</script>

{#if isVisible}
  <div class="bg-[#36f4a4] text-[#003822] px-4 py-2 flex justify-between items-center z-50 relative animate-fade-in">
    <div class="flex-1 flex justify-center items-center gap-3">
      <span class="w-1.5 h-1.5 bg-[#003822] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,56,34,0.5)]"></span>
      <span class="text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate">
        Global Operations Active: Free logistics on UAE drops over $500 AED
      </span>
    </div>
    <button onclick={() => isVisible = false} class="ml-4 opacity-70 hover:opacity-100 transition-opacity focus:outline-none" aria-label="Dismiss">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
{/if}