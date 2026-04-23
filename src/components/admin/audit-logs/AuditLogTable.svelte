<script lang="ts">
  let { logs = [] } = $props<{ logs: any[] }>();
  let expandedLogId = $state<string | null>(null);

  function toggleDiff(id: string) {
    expandedLogId = expandedLogId === id ? null : id;
  }

  function formatJSON(jsonStr: string) {
    try {
      return JSON.stringify(JSON.parse(jsonStr), null, 2);
    } catch {
      return jsonStr;
    }
  }
</script>

<div class="bg-[#111318] border border-white/10 overflow-hidden">
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <th class="p-4 font-normal w-48">Timestamp / IP</th>
          <th class="p-4 font-normal">Actor</th>
          <th class="p-4 font-normal">Action & Target</th>
          <th class="p-4 font-normal text-right">Payload</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each logs as log}
          <tr class="hover:bg-white/[0.02] transition-colors group">
            <td class="p-4">
              <div class="text-xs font-mono text-white/70">{new Date(log.created_at).toLocaleString()}</div>
              <div class="text-[9px] font-mono text-white/30 mt-1">{log.ip_address || 'Unknown IP'}</div>
            </td>
            <td class="p-4">
              <div class="text-xs font-mono font-bold text-[#36f4a4]">{log.actor_email || log.actor_id}</div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span class="text-[9px] px-2 py-0.5 uppercase tracking-widest border border-white/10 text-white/80">{log.action}</span>
                <span class="text-xs font-mono text-white/50">{log.entity_type} <span class="text-white/30">#{log.entity_id.substring(0,8)}</span></span>
              </div>
            </td>
            <td class="p-4 text-right">
              {#if log.details}
                <button onclick={() => toggleDiff(log.id)} class="text-[10px] font-mono uppercase text-white/50 hover:text-[#36f4a4] transition-colors focus:outline-none">
                  {expandedLogId === log.id ? 'Hide Diff' : 'View Diff'}
                </button>
              {:else}
                <span class="text-[10px] font-mono text-white/20 uppercase">Empty</span>
              {/if}
            </td>
          </tr>
          {#if expandedLogId === log.id && log.details}
            <tr class="bg-[#0a0b0e] border-b border-white/5">
              <td colspan="4" class="p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="border border-rose-500/20 bg-rose-500/5 p-3">
                    <div class="text-[9px] font-bold text-rose-400 font-mono uppercase tracking-widest mb-2">Before</div>
                    <pre class="text-[10px] font-mono text-white/60 overflow-x-auto">{formatJSON(log.details).before || 'N/A'}</pre>
                  </div>
                  <div class="border border-[#36f4a4]/20 bg-[#36f4a4]/5 p-3">
                    <div class="text-[9px] font-bold text-[#36f4a4] font-mono uppercase tracking-widest mb-2">After</div>
                    <pre class="text-[10px] font-mono text-white/60 overflow-x-auto">{formatJSON(log.details).after || 'N/A'}</pre>
                  </div>
                </div>
              </td>
            </tr>
          {/if}
        {:else}
          <tr><td colspan="4" class="p-8 text-center text-xs font-mono text-white/30 uppercase">No logs recorded.</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>