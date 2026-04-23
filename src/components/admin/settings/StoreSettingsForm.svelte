<script lang="ts">
  let { initialSettings = {} } = $props<{ initialSettings: any }>();
  
  let name = $state(initialSettings.name || 'Symeno Storefront');
  let currency = $state(initialSettings.currency || 'AED');
  let timezone = $state(initialSettings.timezone || 'Asia/Dubai');
  let logoUrl = $state(initialSettings.logoUrl || '');
  let isSubmitting = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, currency, timezone, logoUrl })
      });
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="bg-[#111318] p-6 sm:p-8 border border-white/10 space-y-6">
  <h2 class="text-xs font-bold text-white font-mono uppercase tracking-widest border-b border-white/10 pb-2">General Identity</h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Store Name</label>
      <input type="text" bind:value={name} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Logo URL (R2)</label>
      <input type="text" bind:value={logoUrl} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Base Currency</label>
      <select bind:value={currency} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono">
        <option value="AED">AED - UAE Dirham</option>
        <option value="SAR">SAR - Saudi Riyal</option>
        <option value="USD">USD - US Dollar</option>
      </select>
    </div>
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Timezone</label>
      <select bind:value={timezone} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono">
        <option value="Asia/Dubai">GST (Asia/Dubai)</option>
        <option value="Asia/Riyadh">AST (Asia/Riyadh)</option>
      </select>
    </div>
  </div>

  <div class="flex justify-end border-t border-white/10 pt-4">
    <button type="submit" disabled={isSubmitting} class="bg-[#36f4a4] text-black px-6 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">
      {isSubmitting ? 'Saving...' : 'Save Configuration'}
    </button>
  </div>
</form>