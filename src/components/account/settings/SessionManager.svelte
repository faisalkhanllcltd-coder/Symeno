<script lang="ts">
  // Mock data as fallback if sessions table isn't fully wired yet
  let sessions = $state([
    {
      id: '1',
      device: 'Mac OS - Chrome',
      location: 'Dubai, UAE',
      ip_address: '192.168.1.1',
      last_active: new Date().toISOString(),
      is_current: true,
    },
    {
      id: '2',
      device: 'iOS - Safari',
      location: 'Abu Dhabi, UAE',
      ip_address: '10.0.0.5',
      last_active: new Date(Date.now() - 86400000).toISOString(),
      is_current: false,
    },
  ]);

  async function revoke(id: string) {
    if (!confirm('Terminate this session link?')) return;
    sessions = sessions.filter((s) => s.id !== id);     
    await fetch('/api/account/sessions', {
      method: 'DELETE',
      body: JSON.stringify({ session_id: id }),
    });
  }
</script>

<div class="space-y-4 transition-colors duration-300">
  <h3
    class="mb-4 font-mono text-xs font-bold tracking-widest text-content uppercase"
  >
    Active Auth Sessions
  </h3>
  <div class="divide-y divide-outline border border-outline bg-base">
    {#each sessions as s}
      <div
        class="flex flex-col items-start justify-between gap-4 p-4 sm:flex-row sm:items-center transition-colors hover:bg-surface"
      >
        <div>
          <div class="mb-1 flex items-center gap-3">    
            <span class="font-mono text-xs font-bold text-content"
              >{s.device}</span
            >
            {#if s.is_current}
              <span
                class="border border-brand/30 bg-brand/10 px-2 py-0.5 text-[9px] tracking-widest text-brand uppercase"
                >Current Node</span
              >
            {/if}
          </div>
          <p class="font-mono text-[10px] text-content-muted">
            {s.location} • IP: {s.ip_address}
          </p>
          <p class="mt-1 font-mono text-[9px] text-content-muted opacity-60">
            Last seen: {new Date(s.last_active).toLocaleString()}
          </p>
        </div>
        {#if !s.is_current}
          <button
            onclick={() => revoke(s.id)}
            class="border border-brand-alert/30 px-4 py-2 font-mono text-[10px] tracking-widest text-brand-alert uppercase transition-colors hover:bg-brand-alert/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm"
            >Revoke</button
          >
        {/if}
      </div>
    {/each}
  </div>
</div>
