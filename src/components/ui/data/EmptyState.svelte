<script lang="ts">
  export let title: string = "No Data Found";
  export let message: string = "There are no records matching your criteria.";
  export let actionLabel: string = "";
</script>

<div class="flex flex-col items-center justify-center text-center p-12 border border-white/10 bg-[#111318]/50">
  <div class="w-16 h-16 border border-white/10 flex items-center justify-center mb-6 bg-white/[0.02]">
    <slot name="icon">
      <svg class="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
    </slot>
  </div>
  <h3 class="text-sm font-bold text-white uppercase tracking-widest font-mono mb-2">{title}</h3>
  <p class="text-xs font-mono text-white/40 mb-6 max-w-sm">{message}</p>
  
  {#if actionLabel}
    <button on:click class="text-[10px] font-mono text-[#36f4a4] hover:text-white uppercase tracking-widest border border-[#36f4a4]/30 hover:border-[#36f4a4] px-4 py-2 transition-colors focus:outline-none bg-[#36f4a4]/5">
      {actionLabel}
    </button>
  {/if}
</div>
