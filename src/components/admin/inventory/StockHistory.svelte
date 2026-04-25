<script lang="ts">
  let { historyLogs = [] } = $props<{ historyLogs?: any[] }>();
</script>

<div class="flex h-full flex-col border border-outline bg-surface p-6">
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Imutable Ledger (Recent Changes)
  </h3>

  <div class="flex-1 space-y-3 overflow-y-auto pr-2">
    {#each historyLogs as log}
      <div
        class="border-l-2 bg-white/5 p-3 {log.adjustment > 0
          ? 'border-brand'
          : 'border-brand-alert'}"
      >
        <div class="mb-2 flex items-center justify-between">
          <span class="bg-brand/10 px-1 font-mono text-[9px] text-brand"
            >{log.sku}</span
          >
          <span class="font-mono text-[9px] text-content-muted"
            >{new Date(log.created_at).toLocaleString()}</span
          >
        </div>
        <div class="flex justify-between text-xs text-content">
          <span class="font-mono text-content-muted">{log.reason}</span>
          <span
            class="font-mono font-bold {log.adjustment > 0
              ? 'text-brand'
              : 'text-brand-alert'}"
          >
            {log.adjustment > 0 ? '+' : ''}{log.adjustment}
            <span class="font-normal text-content-muted"
              >(&rarr; {log.new_stock})</span
            >
          </span>
        </div>
        {#if log.notes}
          <div class="mt-2 font-mono text-[9px] break-words text-content-muted">
            {log.notes}
          </div>
        {/if}
      </div>
    {:else}
      <p class="text-center text-[10px] font-mono text-content-muted uppercase mt-4">
        No recent history.
      </p>
    {/each}
  </div>
</div>
