<script lang="ts">
  import ProfileForm from './ProfileForm.svelte';        
  import SecuritySettings from './SecuritySettings.svelte';
  import NotificationPreferences from './NotificationPreferences.svelte';

  let { user = {} } = $props<{ user?: any }>();
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

<div class="flex flex-col md:flex-row gap-8 transition-colors duration-300">
  <aside class="w-full md:w-64 shrink-0">
    <nav class="flex flex-row md:flex-col gap-2 overflow-x-auto border-b md:border-b-0 md:border-l border-outline md:pl-4 pb-4 md:pb-0">
      {#each tabs as tab}
        <button
          onclick={() => activeTab = tab.id}
          class="whitespace-nowrap text-left px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {activeTab === tab.id ? (tab.id === 'danger' ? 'bg-brand-alert/10 text-brand-alert border-l-2 border-brand-alert -ml-[17px]' : 'bg-brand/10 text-brand border-l-2 border-brand -ml-[17px]') : 'text-content-muted hover:text-content hover:bg-base'}"
        >
          {tab.label}
        </button>
      {/each}
    </nav>
  </aside>

  <div class="flex-1 bg-surface border border-outline p-6 md:p-8 min-h-[500px]">
    {#if activeTab === 'profile'}
      <ProfileForm {user} />
    {:else if activeTab === 'security'}
      <SecuritySettings />
    {:else if activeTab === 'notifications'}
      <NotificationPreferences />
    {:else if activeTab === 'danger'}
      <div class="space-y-8 animate-fade-in">
        <div class="p-6 border border-outline bg-base/50">
          <h3 class="text-xs font-bold uppercase tracking-widest text-content font-mono mb-2">GDPR Data Export</h3>
          <p class="text-[10px] text-content-muted font-mono mb-4 max-w-xl">Download a machine-readable JSON package containing your complete identity and operational history telemetry.</p>
          <a href="/api/account/export" target="_blank" class="inline-block border border-outline text-content px-6 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm">Request Data Package</a>
        </div>

        <div class="p-6 border border-brand-alert/30 bg-brand-alert/5">
          <h3 class="text-xs font-bold uppercase tracking-widest text-brand-alert font-mono mb-2">Account Termination</h3>
          <p class="text-[10px] text-brand-alert/70 font-mono mb-6 max-w-xl">Initiating this protocol will instantly suspend your access. Your operational history will be retained for 30 days for compliance before permanent deletion.</p>

          <div class="flex max-w-sm gap-2">
            <input type="password" bind:value={deletePassword} placeholder="Enter password to confirm" class="flex-1 bg-base/50 border border-brand-alert/30 text-content px-3 py-2 text-sm focus:outline-none focus:border-brand-alert font-mono transition-colors" />
            <button onclick={executeDelete} class="bg-brand-alert/20 text-brand-alert border border-brand-alert/50 hover:bg-brand-alert hover:text-white px-6 text-[10px] font-bold uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm">Terminate</button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
