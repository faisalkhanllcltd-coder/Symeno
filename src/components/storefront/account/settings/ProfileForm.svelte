<script lang="ts">
  let { user = {} } = $props<{ user: any }>();
  let isSubmitting = $state(false);

  let formData = $state({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
    dob: user.dob || '',
    gender: user.gender || '',
    avatar_url: user.avatar_url || ''
  });

  async function handleSave(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) alert('Identity synchronized.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSave} class="space-y-6 animate-fade-in">
  <div class="flex items-center gap-6 mb-8">
    <div class="relative w-24 h-24 bg-[#1A1D23] border border-white/10 rounded-full overflow-hidden group">
      {#if formData.avatar_url}
        <img src={formData.avatar_url} alt="Avatar" class="w-full h-full object-cover opacity-80 group-hover:opacity-50 transition-opacity" />
      {:else}
        <div class="w-full h-full flex items-center justify-center text-white/30 text-2xl font-mono uppercase">
          {formData.first_name?.charAt(0) || 'U'}
        </div>
      {/if}
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-white">Upload</span>
      </div>
    </div>
    <div>
      <h3 class="text-xs font-bold text-white uppercase tracking-widest">Profile Visual</h3>
      <p class="text-[10px] text-white/50 font-mono mt-1">Accepts JPG, PNG. Max 2MB.</p>
      <input type="text" bind:value={formData.avatar_url} placeholder="R2 Image URL..." class="mt-2 w-full max-w-xs bg-[#1A1D23] border border-white/10 text-white px-3 py-1.5 text-xs focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">First Name</label>
      <input type="text" bind:value={formData.first_name} class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Last Name</label>
      <input type="text" bind:value={formData.last_name} class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Phone Vector</label>
      <input type="tel" bind:value={formData.phone} class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Date of Birth</label>
      <input type="date" bind:value={formData.dob} class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Gender (Optional)</label>
      <select bind:value={formData.gender} class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono">
        <option value="">Prefer not to state</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
  </div>

  <div class="pt-4 border-t border-white/10 flex justify-end">
    <button type="submit" disabled={isSubmitting} class="bg-[#36f4a4] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors">
      {isSubmitting ? 'Syncing...' : 'Update Identity'}
    </button>
  </div>
</form>