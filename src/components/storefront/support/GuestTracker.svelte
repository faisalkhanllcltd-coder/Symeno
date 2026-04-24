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
        body: JSON.stringify({ order_id: orderId, email }),
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

<div class="mx-auto max-w-md">
  {#if !orderData}
    <form
      onsubmit={handleTrack}
      class="animate-fade-in space-y-6 border border-white/10 bg-[#111318] p-6 sm:p-8"
    >
      <div class="space-y-2">
        <label
          class="block font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
          >Order Number</label
        >
        <input
          type="text"
          bind:value={orderId}
          required
          placeholder="e.g. 8A9B2C1D"
          class="w-full border border-white/10 bg-[#1A1D23] px-3 py-3 font-mono text-sm text-white transition-colors focus:border-[#36f4a4]/50 focus:outline-none"
        />
      </div>
      <div class="space-y-2">
        <label
          class="block font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
          >Billing Email</label
        >
        <input
          type="email"
          bind:value={email}
          required
          placeholder="operator@symeno.com"
          class="w-full border border-white/10 bg-[#1A1D23] px-3 py-3 font-mono text-sm text-white transition-colors focus:border-[#36f4a4]/50 focus:outline-none"
        />
      </div>

      {#if errorMsg}
        <div
          class="border border-rose-500/30 bg-rose-500/10 p-3 text-center font-mono text-[10px] tracking-widest text-rose-400 uppercase"
        >
          {errorMsg}
        </div>
      {/if}

      <button
        type="submit"
        disabled={isProcessing}
        class="w-full bg-[#36f4a4] px-4 py-3 text-xs font-bold tracking-widest text-[#003822] uppercase shadow-[0_0_15px_rgba(54,244,164,0.15)] transition-colors disabled:opacity-50"
      >
        {isProcessing ? 'Interrogating Database...' : 'Locate Shipment'}
      </button>
    </form>
  {:else}
    <div
      class="animate-fade-in space-y-6 border border-[#36f4a4]/30 bg-[#111318] p-6 text-center sm:p-8"
    >
      <div
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#36f4a4] bg-[#36f4a4]/10"
      >
        <svg
          class="h-8 w-8 text-[#36f4a4]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          /></svg
        >
      </div>
      <div>
        <h3
          class="font-mono text-lg font-bold tracking-widest text-white uppercase"
        >
          Order Found
        </h3>
        <p class="mt-1 font-mono text-xs text-white/50">
          Status: <span class="font-bold text-[#36f4a4]"
            >{orderData.status}</span
          >
        </p>
      </div>

      {#if orderData.tracking_url}
        <a
          href={orderData.tracking_url}
          target="_blank"
          class="block w-full border border-[#36f4a4]/30 bg-[#1A1D23] px-4 py-3 text-xs font-bold tracking-widest text-[#36f4a4] uppercase transition-colors hover:bg-[#36f4a4]/10"
        >
          Open Carrier Tracking
        </a>
      {/if}

      <button
        onclick={() => (orderData = null)}
        class="font-mono text-[10px] tracking-widest text-white/50 uppercase transition-colors hover:text-white"
        >Track Another</button
      >
    </div>
  {/if}
</div>
