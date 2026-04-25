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
  class="space-y-6 border border-outline bg-base p-8"
>
  <div class="mb-6 border-b border-outline pb-4">
    <h2
      class="font-mono text-sm font-bold tracking-widest text-content uppercase"
    >
      Wholesale Authorization
    </h2>
    <p class="mt-1 font-mono text-[10px] text-content-muted">
      Submit corporate credentials to unlock Net-30 terms and Tier-1 pricing.
    </p>
  </div>

  {#if status === 'success'}
    <div
      class="border border-brand/30 bg-brand/10 p-4 font-mono text-xs tracking-widest text-brand uppercase"
    >
      {message}
    </div>
  {:else}
    {#if status === 'error'}
      <div
        class="border border-brand-alert/30 bg-brand-alert/10 p-4 font-mono text-xs tracking-widest text-brand-alert uppercase"
      >
        {message}
      </div>
    {/if}

    <div class="space-y-4">
      <div class="space-y-1.5">
        <label
          class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
          >Registered Company Name</label
        >
        <input
          type="text"
          bind:value={companyName}
          required
          class="w-full border border-outline bg-surface px-4 py-3 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>

      <div class="space-y-1.5">
        <label
          class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
          >Contact Email</label
        >
        <input
          type="email"
          bind:value={contactEmail}
          required
          class="w-full border border-outline bg-surface px-4 py-3 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >Trade License Number</label
          >
          <input
            type="text"
            bind:value={tradeLicense}
            required
            class="w-full border border-outline bg-surface px-4 py-3 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          />
        </div>
        <div class="space-y-1.5">
          <label
            class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
            >Tax ID / VAT Number (Optional)</label
          >
          <input
            type="text"
            bind:value={taxId}
            class="w-full border border-outline bg-surface px-4 py-3 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          />
        </div>
      </div>
    </div>

    <button
      type="submit"
      disabled={isSubmitting}
      class="mt-8 w-full bg-brand px-6 py-4 text-xs font-bold tracking-widest text-brand-dark uppercase transition-colors hover:opacity-80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
    >
      {isSubmitting ? 'Transmitting...' : 'Request Access'}
    </button>
  {/if}
</form>
