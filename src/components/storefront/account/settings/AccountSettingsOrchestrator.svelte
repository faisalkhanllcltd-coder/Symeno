<script lang="ts">
  import ProfileForm from './ProfileForm.svelte';
  import SecuritySettings from './SecuritySettings.svelte';
  import NotificationPreferences from './NotificationPreferences.svelte';

  let { user = {} } = $props<{ user: any }>();
  let activeTab = $state('profile');

  const tabs = [
    { id: 'profile', label: 'Identity' },
    { id: 'security', label: 'Security & Access' },
    { id: 'notifications', label: 'Telemetry' },
    { id: 'danger', label: 'Danger Zone' }
  ];

  let deletePassword = $state('');

  async function executeDelete() {
    if (!deletePassword) return alert('Verification required.');
    if (!confirm('This initiates a permanent soft-delete protocol. Proceed?')) return;
    const res = await fetch('/api/account/delete', { method: 'POST', body: JSON.stringify({ password: deletePassword }) });
    if (res.ok) window.location.href = '/';
  }
</script>

<div class="flex flex-col md:flex-row gap-8">
  <aside class="w-full md:w-64 shrink-0">
    <nav class="flex flex-row md:flex-col gap-2 overflow-x-auto border-b md:border-b-0 md:border-l border-white/10 md:pl-4 pb-4 md:pb-0">
      {#each tabs as tab}
        <button 
          onclick={() => activeTab = tab.id}
          class="whitespace-nowrap text-left px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all {activeTab === tab.id ? (tab.id === 'danger' ? 'bg-rose-500/10 text-rose-400 border-l-2 border-rose-500 -ml-[17px]' : 'bg-[#36f4a4]/10 text-[#36f4a4] border-l-2 border-[#36f4a4] -ml-[17px]') : 'text-white/50 hover:text-white hover:bg-white/5'}"
        >
          {tab.label}
        </button>
      {each}
    </nav>
  </aside>

  <div class="flex-1 bg-[#111318] border border-white/10 p-6 md:p-8 min-h-[500px]">
    {#if activeTab === 'profile'}
      <ProfileForm user={user} />
    {:else if activeTab === 'security'}
      <SecuritySettings />
    {:else if activeTab === 'notifications'}
      <NotificationPreferences />
    {:else if activeTab === 'danger'}
      <div class="space-y-8 animate-fade-in">
        <div class="p-6 border border-white/10 bg-white/[0.02]">
          <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono mb-2">GDPR Data Export</h3>
          <p class="text-[10px] text-white/50 font-mono mb-4 max-w-xl">Download a machine-readable JSON package containing your complete identity and operational history telemetry.</p>
          <a href="/api/account/export" target="_blank" class="inline-block border border-white/10 text-white px-6 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 transition-colors">Request Data Package</a>
        </div>

        <div class="p-6 border border-rose-500/30 bg-rose-500/5">
          <h3 class="text-xs font-bold uppercase tracking-widest text-rose-400 font-mono mb-2">Account Termination</h3>
          <p class="text-[10px] text-rose-400/70 font-mono mb-6 max-w-xl">Initiating this protocol will instantly suspend your access. Your operational history will be retained for 30 days for compliance before permanent deletion.</p>
          
          <div class="flex max-w-sm gap-2">
            <input type="password" bind:value={deletePassword} placeholder="Enter password to confirm" class="flex-1 bg-black/50 border border-rose-500/30 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-400 font-mono" />
            <button onclick={executeDelete} class="bg-rose-500/20 text-rose-400 border border-rose-500/50 hover:bg-rose-500 hover:text-white px-6 text-[10px] font-bold uppercase tracking-widest transition-colors">Terminate</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>