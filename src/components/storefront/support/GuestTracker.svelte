<script lang="ts">
  let orderId = $state('');
  let email = $state('');
  let isProcessing = $state(false);
  let errorMsg = $state('');
  let orderData = $state<any>(null);

  async function handleTrack(e: Event) {
    e.preventDefault();
    isProcessing = true;
    errorMsg = '';
    orderData = null;

    try {
      const res = await fetch('/api/support/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, email })
      });
      
      if (res.ok) {
        orderData = await res.json();
      } else {
        const err = await res.json();
        errorMsg = err.error;
      }
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="max-w-md mx-auto">
  {#if !orderData}
    <form onsubmit={handleTrack} class="bg-[#111318] p-6 sm:p-8 border border-white/10 space-y-6 animate-fade-in">
      <div class="space-y-2">
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">Order Number</label>
        <input type="text" bind:value={orderId} required placeholder="e.g. 8A9B2C1D" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-3 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono transition-colors" />
      </div>
      <div class="space-y-2">
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">Billing Email</label>
        <input type="email" bind:value={email} required placeholder="operator@symeno.com" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-3 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono transition-colors" />
      </div>
      
      {#if errorMsg}
        <div class="p-3 border border-rose-500/30 bg-rose-500/10 text-[10px] font-mono text-rose-400 uppercase tracking-widest text-center">
          {errorMsg}
        </div>
      {/if}

      <button type="submit" disabled={isProcessing} class="w-full bg-[#36f4a4] text-[#003822] px-4 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(54,244,164,0.15)]">
        {isProcessing ? 'Interrogating Database...' : 'Locate Shipment'}
      </button>
    </form>
  {:else}
    <div class="bg-[#111318] p-6 sm:p-8 border border-[#36f4a4]/30 animate-fade-in text-center space-y-6">
      <div class="w-16 h-16 rounded-full border-2 border-[#36f4a4] flex items-center justify-center mx-auto bg-[#36f4a4]/10">
        <svg class="w-8 h-8 text-[#36f4a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
      </div>
      <div>
        <h3 class="text-lg font-bold text-white font-mono uppercase tracking-widest">Order Found</h3>
        <p class="text-xs text-white/50 font-mono mt-1">Status: <span class="text-[#36f4a4] font-bold">{orderData.status}</span></p>
      </div>
      
      {#if orderData.tracking_url}
        <a href={orderData.tracking_url} target="_blank" class="block w-full bg-[#1A1D23] border border-[#36f4a4]/30 text-[#36f4a4] px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#36f4a4]/10 transition-colors">
          Open Carrier Tracking
        </a>
      {/if}
      
      <button onclick={() => orderData = null} class="text-[10px] text-white/50 hover:text-white font-mono uppercase tracking-widest transition-colors">Track Another</button>
    </div>
  {/if}
</div>