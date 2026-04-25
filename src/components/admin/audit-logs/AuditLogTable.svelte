<script lang="ts">
  let { logs = [] } = $props<{ logs?: any[] }>();
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

<div class="overflow-hidden border border-outline bg-surface">
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >
          <th class="w-48 p-4 font-normal">Timestamp / IP</th>
          <th class="p-4 font-normal">Actor</th>
          <th class="p-4 font-normal">Action & Target</th>
          <th class="p-4 text-right font-normal">Payload</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline">
        {#each logs as log}
          <tr class="group transition-colors hover:bg-white/[0.02]">
            <td class="p-4">
              <div class="font-mono text-xs text-content-muted">
                {new Date(log.created_at).toLocaleString()}
              </div>
              <div class="mt-1 font-mono text-[9px] text-content-muted">
                {log.ip_address || 'Unknown IP'}
              </div>
            </td>
            <td class="p-4">
              <div class="font-mono text-xs font-bold text-brand">
                {log.actor_email || log.actor_id}
              </div>
            </td>
            <td class="p-4">
              <div class="flex items-center gap-2">
                <span
                  class="border border-outline px-2 py-0.5 text-[9px] tracking-widest text-content-muted uppercase"
                  >{log.action}</span
                >
                <span class="font-mono text-xs text-content-muted"
                  >{log.entity_type}
                  <span class="text-content-muted"
                    >#{log.entity_id.substring(0, 8)}</span
                  ></span
                >
              </div>
            </td>
            <td class="p-4 text-right">
              {#if log.details}
                <button
                  onclick={() => toggleDiff(log.id)}
                  class="font-mono text-[10px] text-content-muted uppercase transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                >
                  {expandedLogId === log.id ? 'Hide Diff' : 'View Diff'}
                </button>
              {:else}
                <span class="font-mono text-[10px] text-content-muted uppercase"
                  >Empty</span
                >
              {/if}
            </td>
          </tr>
          {#if expandedLogId === log.id && log.details}
            <tr class="border-b border-outline bg-base">
              <td colspan="4" class="p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="border border-brand-alert/20 bg-brand-alert/5 p-3">
                    <div
                      class="mb-2 font-mono text-[9px] font-bold tracking-widest text-brand-alert uppercase"
                    >
                      Before
                    </div>
                    <pre
                      class="overflow-x-auto font-mono text-[10px] text-content-muted">{formatJSON(
                        log.details
                      ).before || 'N/A'}</pre>
                  </div>
                  <div class="border border-brand/20 bg-brand/5 p-3">
                    <div
                      class="mb-2 font-mono text-[9px] font-bold tracking-widest text-brand uppercase"
                    >
                      After
                    </div>
                    <pre
                      class="overflow-x-auto font-mono text-[10px] text-content-muted">{formatJSON(
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
              class="p-8 text-center text-xs font-mono text-content-muted uppercase"
              >No logs recorded.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
