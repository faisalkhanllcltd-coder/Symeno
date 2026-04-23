<script lang="ts">
  let companyName = $state('');
  let tradeLicense = $state('');
  let taxId = $state('');
  let contactEmail = $state('');
  
  let isSubmitting = $state(false);
  let status = $state<'idle' | 'success' | 'error'>('idle');
  let message = $state('');

  async function submitApplication(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    status = 'idle';

    try {
      const res = await fetch('/api/b2b/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          trade_license: tradeLicense,
          tax_id: taxId,
          contact_email: contactEmail
        })
      });

      if (res.ok) {
        status = 'success';
        message = 'Application received. Our verification team will contact you within 24 hours.';
        companyName = ''; tradeLicense = ''; taxId = ''; contactEmail = '';
      } else {
        const err = await res.json();
        status = 'error';
        message = err.error || 'Transmission failed.';
      }
    } catch {
      status = 'error';
      message = 'Network anomaly detected. Try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={submitApplication} class="bg-[#111318] border border-white/10 p-8 space-y-6">
  <div class="border-b border-white/10 pb-4 mb-6">
    <h2 class="text-sm font-bold text-white uppercase tracking-widest font-mono">Wholesale Authorization</h2>
    <p class="text-[10px] text-white/50 font-mono mt-1">Submit corporate credentials to unlock Net-30 terms and Tier-1 pricing.</p>
  </div>

  {#if status === 'success'}
    <div class="bg-[#36f4a4]/10 border border-[#36f4a4]/30 p-4 text-[#36f4a4] text-xs font-mono uppercase tracking-widest">
      {message}
    </div>
  {:else}
    {#if status === 'error'}
      <div class="bg-rose-500/10 border border-rose-500/30 p-4 text-rose-400 text-xs font-mono uppercase tracking-widest">
        {message}
      </div>
    {/if}

    <div class="space-y-4">
      <div class="space-y-1.5">
        <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Registered Company Name</label>
        <input type="text" bind:value={companyName} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#36f4a4]/50 transition-colors font-mono" />
      </div>

      <div class="space-y-1.5">
        <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Contact Email</label>
        <input type="email" bind:value={contactEmail} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#36f4a4]/50 transition-colors font-mono" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Trade License Number</label>
          <input type="text" bind:value={tradeLicense} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#36f4a4]/50 transition-colors font-mono" />
        </div>
        <div class="space-y-1.5">
          <label class="text-[10px] font-mono text-white/50 uppercase tracking-widest">Tax ID / VAT Number (Optional)</label>
          <input type="text" bind:value={taxId} class="w-full bg-[#1A1D23] border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-[#36f4a4]/50 transition-colors font-mono" />
        </div>
      </div>
    </div>

    <button type="submit" disabled={isSubmitting} class="w-full mt-8 bg-[#36f4a4] text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50">
      {isSubmitting ? 'Transmitting...' : 'Request Access'}
    </button>
  {/if}
</form>