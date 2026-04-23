<script lang="ts">
  let { historyLogs = [] } = $props<{ historyLogs: any[] }>();
</script>

<div class="bg-[#111318] border border-white/10 p-6 h-full flex flex-col">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">Imutable Ledger (Recent Changes)</h3>
  
  <div class="flex-1 overflow-y-auto pr-2 space-y-3">
    {#each historyLogs as log}
      <div class="bg-white/5 p-3 border-l-2 {log.adjustment > 0 ? 'border-[#36f4a4]' : 'border-rose-400'}">
        <div class="flex justify-between items-center mb-2">
          <span class="text-[9px] font-mono text-[#36f4a4] bg-[#36f4a4]/10 px-1">{log.sku}</span>
          <span class="text-[9px] font-mono text-white/40">{new Date(log.created_at).toLocaleString()}</span>
        </div>
        <div class="flex justify-between text-xs text-white">
          <span class="font-mono text-white/60">{log.reason}</span>
          <span class="font-mono font-bold {log.adjustment > 0 ? 'text-[#36f4a4]' : 'text-rose-400'}">
            {log.adjustment > 0 ? '+' : ''}{log.adjustment} 
            <span class="text-white/30 font-normal">(&rarr; {log.new_stock})</span>
          </span>
        </div>
        {#if log.notes}
          <div class="text-[9px] text-white/40 mt-2 font-mono break-words">{log.notes}</div>
        {/if}
      </div>
    {:else}
      <p class="text-center text-[10px] font-mono text-white/30 uppercase mt-4">No recent history.</p>
    {/each}
  </div>
</div>