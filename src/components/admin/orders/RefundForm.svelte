<script lang="ts">
  let { orderId, maxAmount, stripePaymentId } = $props<{ orderId: string, maxAmount: number, stripePaymentId: string }>();
  let amount = $state(maxAmount);
  let reason = $state('');
  let isProcessing = $state(false);

  async function processRefund(e: Event) {
    e.preventDefault();
    if (!confirm(`Are you sure you want to refund $${amount}? This action cannot be reversed via the UI.`)) return;
    
    isProcessing = true;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason, stripe_payment_id: stripePaymentId })
      });
      if (res.ok) location.reload();
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="bg-[#111318] p-6 border border-rose-500/30">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-rose-400 font-mono mb-4">Financial Remediation</h3>
  <form onsubmit={processRefund} class="space-y-4">
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Refund Amount (Max: ${maxAmount.toFixed(2)})</label>
      <input type="number" step="0.01" max={maxAmount} bind:value={amount} required class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-400/50 font-mono" />
    </div>
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">Reason</label>
      <input type="text" bind:value={reason} required placeholder="e.g. Damaged in transit" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-rose-400/50 font-mono" />
    </div>
    <button type="submit" disabled={isProcessing} class="w-full bg-rose-500/10 text-rose-400 border border-rose-500/30 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50">
      {isProcessing ? 'Communicating with Stripe...' : 'Issue Refund'}
    </button>
  </form>
</div>