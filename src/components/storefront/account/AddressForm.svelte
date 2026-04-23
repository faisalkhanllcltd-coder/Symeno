<script lang="ts">
  let { address = null, onSave, onCancel } = $props<{ address: any, onSave: (data: any) => void, onCancel: () => void }>();
  
  let formData = $state({
    id: address?.id || '',
    label: address?.label || 'Home',
    full_name: address?.full_name || '',
    phone: address?.phone || '',
    country: address?.country || 'United Arab Emirates', // Defaults to your primary market
    state: address?.state || 'Dubai',
    city: address?.city || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    landmark: address?.landmark || '',
    is_default: address ? (address.is_default === 1) : false
  });

  const countries = ['United Arab Emirates', 'United States', 'Saudi Arabia', 'United Kingdom', 'Qatar', 'Bahrain', 'Oman'];
  const emirates = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

  let isUAE = $derived(formData.country === 'United Arab Emirates');

  // Auto-prefix phone numbers based on country if empty
  $effect(() => {
    if (!formData.phone) {
      if (formData.country === 'United Arab Emirates') formData.phone = '+971 ';
      if (formData.country === 'United States') formData.phone = '+1 ';
      if (formData.country === 'Saudi Arabia') formData.phone = '+966 ';
    }
  });

  function submit(e: Event) {
    e.preventDefault();
    onSave(formData);
  }
</script>

<form onsubmit={submit} class="bg-[#111318] p-6 border border-white/10 space-y-6">
  <div class="flex justify-between items-center border-b border-white/10 pb-4">
    <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono">{address ? 'Edit Address' : 'New Address'}</h3>
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" bind:checked={formData.is_default} class="accent-[#36f4a4] w-4 h-4 bg-[#1A1D23] border-white/10" />
      <span class="text-[10px] font-mono text-white/70 uppercase tracking-widest">Set as Default</span>
    </label>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="md:col-span-2">
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Address Label</label>
      <div class="flex gap-4">
        {#each ['Home', 'Work', 'Other'] as l}
          <label class="flex items-center gap-2 cursor-pointer border border-white/10 p-2 flex-1 justify-center transition-colors {formData.label === l ? 'bg-[#36f4a4]/10 border-[#36f4a4]/30 text-[#36f4a4]' : 'bg-[#1A1D23] text-white/50 hover:border-white/30'}">
            <input type="radio" value={l} bind:group={formData.label} class="hidden" />
            <span class="text-[10px] font-mono uppercase tracking-widest">{l}</span>
          </label>
        {/each}
      </div>
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Recipient Full Name</label>
      <input type="text" bind:value={formData.full_name} required class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
    
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Phone Number</label>
      <input type="tel" bind:value={formData.phone} required class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Country</label>
      <select bind:value={formData.country} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono cursor-pointer">
        {#each countries as c}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">{isUAE ? 'Emirate' : 'State / Province'}</label>
      {#if isUAE}
        <select bind:value={formData.state} required class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono cursor-pointer">
          {#each emirates as emirate}
            <option value={emirate}>{emirate}</option>
          {/each}
        </select>
      {:else}
        <input type="text" bind:value={formData.state} required placeholder="e.g. Wyoming, TX, ON" class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
      {/if}
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">City / Area</label>
      <input type="text" bind:value={formData.city} required placeholder={isUAE ? "e.g. Dubai Marina" : "e.g. Cheyenne"} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Street Name / No.</label>
      <input type="text" bind:value={formData.line1} required class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">{isUAE ? 'Building & Villa/Flat No.' : 'Apt, Suite, Unit'}</label>
      <input type="text" bind:value={formData.line2} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">{isUAE ? 'Nearest Landmark (Recommended)' : 'ZIP / Postal Code'}</label>
      <input type="text" bind:value={formData.landmark} required={!isUAE} placeholder={isUAE ? "e.g. Behind Spinneys" : "e.g. 82001"} class="w-full bg-[#1A1D23] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
  </div>

  <div class="flex gap-4 pt-4 border-t border-white/10">
    <button type="button" onclick={onCancel} class="flex-1 border border-white/10 text-white/70 px-4 py-3 text-xs font-mono uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
    <button type="submit" class="flex-1 bg-[#36f4a4] text-[#003822] px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_15px_rgba(54,244,164,0.15)]">Save Address</button>
  </div>
</form>