<script lang="ts">
  let { orderId, maxAmount, stripePaymentId } = $props<{
    orderId: string;
    maxAmount: number;
    stripePaymentId: string;
  }>();
  let amount = $state(maxAmount);
  let reason = $state('');
  let isProcessing = $state(false);

  async function processRefund(e: Event) {
    e.preventDefault();
    if (
      !confirm(
        `Are you sure you want to refund $${amount}? This action cannot be reversed via the UI.`
      )
    )
      return;

    isProcessing = true;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          reason,
          stripe_payment_id: stripePaymentId,
        }),
      });
      if (res.ok) location.reload();
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="border border-rose-500/30 bg-surface p-6">
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-rose-400 uppercase"
  >
    Financial Remediation
  </h3>
  <form onsubmit={processRefund} class="space-y-4">
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Refund Amount (Max: ${maxAmount.toFixed(2)})</label
      >
      <input
        type="number"
        step="0.01"
        max={maxAmount}
        bind:value={amount}
        required
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-rose-400/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-sm"
      />
    </div>
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Reason</label
      >
      <input
        type="text"
        bind:value={reason}
        required
        placeholder="e.g. Damaged in transit"
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-rose-400/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-sm"
      />
    </div>
    <button
      type="submit"
      disabled={isProcessing}
      class="w-full border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold tracking-widest text-rose-400 uppercase transition-colors hover:bg-rose-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-sm disabled:opacity-50"
    >
      {isProcessing ? 'Communicating with Stripe...' : 'Issue Refund'}
    </button>
  </form>
</div>
