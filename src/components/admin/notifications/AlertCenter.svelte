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
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        if (id === 'ALL') {
          alerts = alerts.map((a) => ({ ...a, is_read: 1 }));
        } else {
          const index = alerts.findIndex((a) => a.id === id);
          if (index !== -1) alerts[index].is_read = 1;
        }
      }
    } finally {
      isProcessing = false;
    }
  }

  let unreadCount = $derived(alerts.filter((a) => !a.is_read).length);
</script>

<div class="flex h-full flex-col border border-white/10 bg-[#111318]">
  <div
    class="flex items-center justify-between border-b border-white/10 bg-[#1A1D23] p-4"
  >
    <div
      class="font-mono text-[10px] font-bold tracking-widest text-[#36f4a4] uppercase"
    >
      {unreadCount} Unread Alerts
    </div>
    {#if unreadCount > 0}
      <button
        onclick={() => markRead('ALL')}
        disabled={isProcessing}
        class="font-mono text-[10px] text-white/50 uppercase transition-colors hover:text-white"
        >Mark All Read</button
      >
    {/if}
  </div>

  <div class="flex-1 overflow-y-auto">
    <ul class="divide-y divide-white/5">
      {#each alerts as alert}
        <li
          class="flex items-start justify-between p-4 transition-colors hover:bg-white/[0.02] {alert.is_read
            ? 'opacity-50'
            : ''}"
        >
          <div class="flex gap-4">
            <div class="mt-1">
              {#if alert.priority === 'HIGH'}
                <div
                  class="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                ></div>
              {:else if alert.priority === 'MEDIUM'}
                <div class="h-2 w-2 rounded-full bg-amber-400"></div>
              {:else}
                <div class="h-2 w-2 rounded-full bg-[#36f4a4]"></div>
              {/if}
            </div>
            <div>
              <div class="mb-1 text-xs font-bold text-white">{alert.title}</div>
              <div class="mb-2 font-mono text-[10px] text-white/60">
                {alert.message}
              </div>
              <div class="font-mono text-[9px] text-white/30">
                {new Date(alert.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          {#if !alert.is_read}
            <button
              onclick={() => markRead(alert.id)}
              disabled={isProcessing}
              class="border border-white/10 px-2 py-1 font-mono text-[10px] tracking-widest text-white uppercase hover:bg-white/10"
              >Clear</button
            >
          {/if}
        </li>
      {:else}
        <li class="p-8 text-center text-xs font-mono text-white/30 uppercase">
          System operating normally. No alerts.
        </li>
      {/each}
    </ul>
  </div>
</div>
