<script lang="ts">
  let { historyLogs = [] } = $props<{ historyLogs: any[] }>();
</script>

<div class="flex h-full flex-col border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
  >
    Imutable Ledger (Recent Changes)
  </h3>

  <div class="flex-1 space-y-3 overflow-y-auto pr-2">
    {#each historyLogs as log}
      <div
        class="border-l-2 bg-white/5 p-3 {log.adjustment > 0
          ? 'border-[#36f4a4]'
          : 'border-rose-400'}"
      >
        <div class="mb-2 flex items-center justify-between">
          <span class="bg-[#36f4a4]/10 px-1 font-mono text-[9px] text-[#36f4a4]"
            >{log.sku}</span
          >
          <span class="font-mono text-[9px] text-white/40"
            >{new Date(log.created_at).toLocaleString()}</span
          >
        </div>
        <div class="flex justify-between text-xs text-white">
          <span class="font-mono text-white/60">{log.reason}</span>
          <span
            class="font-mono font-bold {log.adjustment > 0
              ? 'text-[#36f4a4]'
              : 'text-rose-400'}"
          >
            {log.adjustment > 0 ? '+' : ''}{log.adjustment}
            <span class="font-normal text-white/30"
              >(&rarr; {log.new_stock})</span
            >
          </span>
        </div>
        {#if log.notes}
          <div class="mt-2 font-mono text-[9px] break-words text-white/40">
            {log.notes}
          </div>
        {/if}
      </div>
    {:else}
      <p class="text-center text-[10px] font-mono text-white/30 uppercase mt-4">
        No recent history.
      </p>
    {/each}
  </div>
</div>
