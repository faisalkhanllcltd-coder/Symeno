<script lang="ts">
  let { ledger = [] } = $props<{ ledger?: any[] }>();    
</script>

<div class="overflow-hidden border border-outline bg-surface transition-colors duration-300">
  <div class="border-b border-outline p-4">
    <h3
      class="font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      Ledger History
    </h3>
  </div>
  <table class="w-full border-collapse text-left">      
    <tbody class="divide-y divide-outline">        
      {#each ledger as entry}
        <tr class="transition-colors hover:bg-base">
          <td class="p-4">
            <div class="mb-1 text-xs font-bold text-content">{entry.reason}</div>
            <div class="font-mono text-[9px] text-content-muted">
              {new Date(entry.created_at).toLocaleString()}
            </div>
          </td>
          <td class="p-4 text-right">
            <span
              class="font-mono text-sm font-bold {entry.points > 0
                ? 'text-brand'
                : 'text-brand-alert'}"
            >
              {entry.points > 0 ? '+' : ''}{entry.points}
            </span>
          </td>
        </tr>
      {:else}
        <tr
          ><td
            colspan="2"
            class="p-8 text-center text-[10px] font-mono text-content-muted uppercase tracking-widest"
            >No ledger events recorded.</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>
