<script lang="ts">
  let { ledger = [] } = $props<{ ledger: any[] }>();
</script>

<div class="bg-[#111318] border border-white/10 overflow-hidden">
  <div class="p-4 border-b border-white/10">
    <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono">Ledger History</h3>
  </div>
  <table class="w-full text-left border-collapse">
    <tbody class="divide-y divide-white/[0.04]">
      {#each ledger as entry}
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="p-4">
            <div class="text-xs font-bold text-white mb-1">{entry.reason}</div>
            <div class="text-[9px] font-mono text-white/40">{new Date(entry.created_at).toLocaleString()}</div>
          </td>
          <td class="p-4 text-right">
            <span class="text-sm font-bold font-mono {entry.points > 0 ? 'text-[#36f4a4]' : 'text-rose-400'}">
              {entry.points > 0 ? '+' : ''}{entry.points}
            </span>
          </td>
        </tr>
      {:else}
        <tr><td colspan="2" class="p-8 text-center text-[10px] font-mono text-white/30 uppercase">No ledger events recorded.</td></tr>
      {/each}
    </tbody>
  </table>
</div>