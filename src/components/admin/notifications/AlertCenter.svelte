<script lang="ts">
  let { initialAlerts = [] } = $props<{ initialAlerts: any[] }>();
  let alerts = $state(initialAlerts);
  let isProcessing = $state(false);

  async function markRead(id: string) {
    isProcessing = true;
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        if (id === 'ALL') {
          alerts = alerts.map(a => ({ ...a, is_read: 1 }));
        } else {
          const index = alerts.findIndex(a => a.id === id);
          if (index !== -1) alerts[index].is_read = 1;
        }
      }
    } finally {
      isProcessing = false;
    }
  }

  let unreadCount = $derived(alerts.filter(a => !a.is_read).length);
</script>

<div class="bg-[#111318] border border-white/10 h-full flex flex-col">
  <div class="p-4 border-b border-white/10 flex justify-between items-center bg-[#1A1D23]">
    <div class="text-[10px] font-bold uppercase tracking-widest text-[#36f4a4] font-mono">
      {unreadCount} Unread Alerts
    </div>
    {#if unreadCount > 0}
      <button onclick={() => markRead('ALL')} disabled={isProcessing} class="text-[10px] font-mono uppercase text-white/50 hover:text-white transition-colors">Mark All Read</button>
    {/if}
  </div>

  <div class="flex-1 overflow-y-auto">
    <ul class="divide-y divide-white/5">
      {#each alerts as alert}
        <li class="p-4 hover:bg-white/[0.02] transition-colors flex justify-between items-start {alert.is_read ? 'opacity-50' : ''}">
          <div class="flex gap-4">
            <div class="mt-1">
              {#if alert.priority === 'HIGH'}
                <div class="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></div>
              {:else if alert.priority === 'MEDIUM'}
                <div class="w-2 h-2 rounded-full bg-amber-400"></div>
              {:else}
                <div class="w-2 h-2 rounded-full bg-[#36f4a4]"></div>
              {/if}
            </div>
            <div>
              <div class="text-xs font-bold text-white mb-1">{alert.title}</div>
              <div class="text-[10px] font-mono text-white/60 mb-2">{alert.message}</div>
              <div class="text-[9px] font-mono text-white/30">{new Date(alert.created_at).toLocaleString()}</div>
            </div>
          </div>
          {#if !alert.is_read}
            <button onclick={() => markRead(alert.id)} disabled={isProcessing} class="text-[10px] border border-white/10 px-2 py-1 font-mono uppercase tracking-widest hover:bg-white/10 text-white">Clear</button>
          {/if}
        </li>
      {:else}
        <li class="p-8 text-center text-xs font-mono text-white/30 uppercase">System operating normally. No alerts.</li>
      {/each}
    </ul>
  </div>
</div>