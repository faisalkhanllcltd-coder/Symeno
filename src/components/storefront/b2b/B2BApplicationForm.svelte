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
          contact_email: contactEmail,
        }),
      });

      if (res.ok) {
        status = 'success';
        message =
          'Application received. Our verification team will contact you within 24 hours.';
        companyName = '';
        tradeLicense = '';
        taxId = '';
        contactEmail = '';
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

<form
  onsubmit={submitApplication}
  class="space-y-6 border border-white/10 bg-[#111318] p-8"
>
  <div class="mb-6 border-b border-white/10 pb-4">
    <h2
      class="font-mono text-sm font-bold tracking-widest text-white uppercase"
    >
      Wholesale Authorization
    </h2>
    <p class="mt-1 font-mono text-[10px] text-white/50">
      Submit corporate credentials to unlock Net-30 terms and Tier-1 pricing.
    </p>
  </div>

  {#if status === 'success'}
    <div
      class="border border-[#36f4a4]/30 bg-[#36f4a4]/10 p-4 font-mono text-xs tracking-widest text-[#36f4a4] uppercase"
    >
      {message}
    </div>
  {:else}
    {#if status === 'error'}
      <div
        class="border border-rose-500/30 bg-rose-500/10 p-4 font-mono text-xs tracking-widest text-rose-400 uppercase"
      >
        {message}
      </div>
    {/if}

    <div class="space-y-4">
      <div class="space-y-1.5">
        <label
          class="font-mono text-[10px] tracking-widest text-white/50 uppercase"
          >Registered Company Name</label
        >
        <input
          type="text"
          bind:value={companyName}
          required
          class="w-full border border-white/10 bg-[#1A1D23] px-4 py-3 font-mono text-sm text-white transition-colors focus:border-[#36f4a4]/50 focus:outline-none"
        />
      </div>

      <div class="space-y-1.5">
        <label
          class="font-mono text-[10px] tracking-widest text-white/50 uppercase"
          >Contact Email</label
        >
        <input
          type="email"
          bind:value={contactEmail}
          required
          class="w-full border border-white/10 bg-[#1A1D23] px-4 py-3 font-mono text-sm text-white transition-colors focus:border-[#36f4a4]/50 focus:outline-none"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-white/50 uppercase"
            >Trade License Number</label
          >
          <input
            type="text"
            bind:value={tradeLicense}
            required
            class="w-full border border-white/10 bg-[#1A1D23] px-4 py-3 font-mono text-sm text-white transition-colors focus:border-[#36f4a4]/50 focus:outline-none"
          />
        </div>
        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-white/50 uppercase"
            >Tax ID / VAT Number (Optional)</label
          >
          <input
            type="text"
            bind:value={taxId}
            class="w-full border border-white/10 bg-[#1A1D23] px-4 py-3 font-mono text-sm text-white transition-colors focus:border-[#36f4a4]/50 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      class="mt-8 w-full bg-[#36f4a4] px-6 py-4 text-xs font-bold tracking-widest text-black uppercase transition-colors hover:bg-white disabled:opacity-50"
    >
      {isSubmitting ? 'Transmitting...' : 'Request Access'}
    </button>
  {/if}
</form>
