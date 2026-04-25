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
      class="animate-fade-in space-y-6 border border-outline bg-base p-6 sm:p-8"
    >
      <div class="space-y-2">
        <label
          class="block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Order Number</label
        >
        <input
          type="text"
          bind:value={orderId}
          required
          placeholder="e.g. 8A9B2C1D"
          class="w-full border border-outline bg-surface px-3 py-3 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>
      <div class="space-y-2">
        <label
          class="block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Billing Email</label
        >
        <input
          type="email"
          bind:value={email}
          required
          placeholder="operator@symeno.com"
          class="w-full border border-outline bg-surface px-3 py-3 font-mono text-sm text-content transition-colors focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>

      {#if errorMsg}
        <div
          class="border border-brand-alert/30 bg-brand-alert/10 p-3 text-center font-mono text-[10px] tracking-widest text-brand-alert uppercase"
        >
          {errorMsg}
        </div>
      {/if}

      <button
        type="submit"
        disabled={isProcessing}
        class="w-full bg-brand px-4 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase shadow-[0_0_15px_var(--color-brand,rgba(54,244,164,0.15))] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
      >
        {isProcessing ? 'Interrogating Database...' : 'Locate Shipment'}
      </button>
    </form>
  {:else}
    <div
      class="animate-fade-in space-y-6 border border-brand/30 bg-base p-6 text-center sm:p-8"
    >
      <div
        class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand bg-brand/10"
      >
        <svg
          class="h-8 w-8 text-brand"
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
          class="font-mono text-lg font-bold tracking-widest text-content uppercase"
        >
          Order Found
        </h3>
        <p class="mt-1 font-mono text-xs text-content-muted">
          Status: <span class="font-bold text-brand"
            >{orderData.status}</span
          >
        </p>
      </div>

      {#if orderData.tracking_url}
        <a
          href={orderData.tracking_url}
          target="_blank"
          class="block w-full border border-brand/30 bg-surface px-4 py-3 text-xs font-bold tracking-widest text-brand uppercase transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >
          Open Carrier Tracking
        </a>
      {/if}

      <button
        onclick={() => (orderData = null)}
        class="font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        >Track Another</button
      >
    </div>
  {/if}
</div>
