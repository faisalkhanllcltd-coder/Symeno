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

<div class="overflow-hidden border border-white/10 bg-[#111318]">
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
        >
          <th class="w-48 p-4 font-normal">Timestamp / IP</th>
          <th class="p-4 font-normal">Actor</th>
          <th class="p-4 font-normal">Action & Target</th>
          <th class="p-4 text-right font-normal">Payload</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each logs as log}
          <tr class="group transition-colors hover:bg-white/[0.02]">
            <td class="p-4">
              <div class="font-mono text-xs text-white/70">
                {new Date(log.created_at).toLocaleString()}
              </div>
              <div class="mt-1 font-mono text-[9px] text-white/30">
                {log.ip_address || 'Unknown IP'}
              </div>
            </td>
            <td class="p-4">
              <div class="font-mono text-xs font-bold text-[#36f4a4]">
                {log.actor_email || log.actor_id}
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span
                  class="border border-white/10 px-2 py-0.5 text-[9px] tracking-widest text-white/80 uppercase"
                  >{log.action}</span
                >
                <span class="font-mono text-xs text-white/50"
                  >{log.entity_type}
                  <span class="text-white/30"
                    >#{log.entity_id.substring(0, 8)}</span
                  ></span
                >
              </div>
            </td>
            <td class="p-4 text-right">
              {#if log.details}
                <button
                  onclick={() => toggleDiff(log.id)}
                  class="font-mono text-[10px] text-white/50 uppercase transition-colors hover:text-[#36f4a4] focus:outline-none"
                >
                  {expandedLogId === log.id ? 'Hide Diff' : 'View Diff'}
                </button>
              {:else}
                <span class="font-mono text-[10px] text-white/20 uppercase"
                  >Empty</span
                >
              {/if}
            </td>
          </tr>
          {#if expandedLogId === log.id && log.details}
            <tr class="border-b border-white/5 bg-[#0a0b0e]">
              <td colspan="4" class="p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="border border-rose-500/20 bg-rose-500/5 p-3">
                    <div
                      class="mb-2 font-mono text-[9px] font-bold tracking-widest text-rose-400 uppercase"
                    >
                      Before
                    </div>
                    <pre
                      class="overflow-x-auto font-mono text-[10px] text-white/60">{formatJSON(
                        log.details
                      ).before || 'N/A'}</pre>
                  </div>
                  <div class="border border-[#36f4a4]/20 bg-[#36f4a4]/5 p-3">
                    <div
                      class="mb-2 font-mono text-[9px] font-bold tracking-widest text-[#36f4a4] uppercase"
                    >
                      After
                    </div>
                    <pre
                      class="overflow-x-auto font-mono text-[10px] text-white/60">{formatJSON(
                        log.details
                      ).after || 'N/A'}</pre>
                  </div>
                </div>
              </td>
            </tr>
          {/if}
        {:else}
          <tr
            ><td
              colspan="4"
              class="p-8 text-center text-xs font-mono text-white/30 uppercase"
              >No logs recorded.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
