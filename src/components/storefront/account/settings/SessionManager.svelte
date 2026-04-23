<script lang="ts">
  // Mock data as fallback if sessions table isn't fully wired yet
  let sessions = $state([
    { id: '1', device: 'Mac OS - Chrome', location: 'Dubai, UAE', ip_address: '192.168.1.1', last_active: new Date().toISOString(), is_current: true },
    { id: '2', device: 'iOS - Safari', location: 'Abu Dhabi, UAE', ip_address: '10.0.0.5', last_active: new Date(Date.now() - 86400000).toISOString(), is_current: false }
  ]);

  async function revoke(id: string) {
    if(!confirm('Terminate this session link?')) return;
    sessions = sessions.filter(s => s.id !== id);
    await fetch('/api/account/sessions', { method: 'DELETE', body: JSON.stringify({ session_id: id }) });
  }
</script>

<div class="space-y-4">
  <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono mb-4">Active Auth Sessions</h3>
  <div class="divide-y divide-white/5 border border-white/10 bg-[#1A1D23]">
    {#each sessions as s}
      <div class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <span class="text-xs font-bold text-white font-mono">{s.device}</span>
            {#if s.is_current}
              <span class="text-[9px] px-2 py-0.5 border border-[#36f4a4]/30 text-[#36f4a4] bg-[#36f4a4]/10 uppercase tracking-widest">Current Node</span>
            {/if}
          </div>
          <p class="text-[10px] font-mono text-white/50">{s.location} • IP: {s.ip_address}</p>
          <p class="text-[9px] font-mono text-white/30 mt-1">Last seen: {new Date(s.last_active).toLocaleString()}</p>
        </div>
        {#if !s.is_current}
          <button onclick={() => revoke(s.id)} class="border border-rose-500/30 text-rose-400 px-4 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-rose-500/10 transition-colors focus:outline-none">Revoke</button>
        {/if}
      </div>
    {/each}
  </div>
</div>