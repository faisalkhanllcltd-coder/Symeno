<script lang="ts">
  let orderId = $state('');
  let email = $state('');
  let isTracking = $state(false);
  let errorMsg = $state('');
  let orderDetails = $state<{ id: string; status: string; created_at: string } | null>(null);

  async function handleTrack(e: Event) {
    e.preventDefault();
    errorMsg = '';
    orderDetails = null;

    if (!orderId || !email) {
      errorMsg = 'Please provide both Order ID and Email.';
      return;
    }

    isTracking = true;

    try {
      const res = await fetch('/api/support/track-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderId.trim(), email: email.trim().toLowerCase() })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Order not found or access denied.');
      }

      orderDetails = await res.json();
    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      isTracking = false;
    }
  }

  const statuses = ['pending', 'processing', 'shipped', 'delivered'];
  let currentStepIndex = $derived(orderDetails ? statuses.indexOf(orderDetails.status.toLowerCase()) : -1);
</script>

<div class="mx-auto max-w-xl">
  {#if !orderDetails}
    <form onsubmit={handleTrack} class="bg-surface border-outline space-y-6 rounded-xl border p-8 shadow-sm">
      <div class="space-y-4">
        <div>
          <label for="orderId" class="text-content font-mono text-xs font-bold tracking-widest uppercase">Order ID</label>
          <input
            id="orderId"
            type="text"
            bind:value={orderId}
            placeholder="e.g., SYM-10482"
            class="bg-base border-outline text-content focus:border-brand mt-2 w-full rounded-md border p-3 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>
        <div>
          <label for="email" class="text-content font-mono text-xs font-bold tracking-widest uppercase">Email Address</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="Used at checkout"
            class="bg-base border-outline text-content focus:border-brand mt-2 w-full rounded-md border p-3 font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-brand"
            required
          />
        </div>
      </div>

      {#if errorMsg}
        <div class="bg-brand-alert/10 border-brand-alert text-brand-alert rounded border p-3 font-mono text-xs font-bold uppercase">
          {errorMsg}
        </div>
      {/if}

      <button
        type="submit"
        disabled={isTracking}
        class="bg-brand text-brand-dark w-full rounded-md py-4 text-sm font-bold tracking-widest uppercase transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        {isTracking ? 'Querying Edge Matrix...' : 'Track Order'}
      </button>
    </form>
  {:else}
    <div class="bg-surface border-outline rounded-xl border p-8 shadow-sm">
      <div class="mb-8 flex items-start justify-between border-b border-outline pb-6">
        <div>
          <h3 class="text-content font-sans text-xl font-bold uppercase">Order {orderDetails.id}</h3>
          <p class="text-content-muted mt-1 font-mono text-xs tracking-widest uppercase">
            Placed {new Date(orderDetails.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onclick={() => (orderDetails = null)}
          class="text-content-muted hover:text-brand font-mono text-[10px] font-bold tracking-widest uppercase focus-visible:outline-none"
        >
          Reset
        </button>
      </div>

      <div class="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-outline before:to-transparent">
        {#each statuses as status, i}
          <div class="relative flex items-center gap-6">
            <div
              class="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 {i <= currentStepIndex ? 'bg-brand border-brand text-brand-dark' : 'bg-base border-outline text-content-muted'}"
            >
              {#if i < currentStepIndex}
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              {:else if i === currentStepIndex}
                <div class="h-2.5 w-2.5 rounded-full bg-current animate-pulse"></div>
              {/if}
            </div>
            <div>
              <h4 class="font-mono text-sm font-bold uppercase {i <= currentStepIndex ? 'text-content' : 'text-content-muted'}">
                {status}
              </h4>
              {#if i === currentStepIndex}
                <p class="text-brand mt-1 font-mono text-[10px] tracking-widest uppercase">Current Status</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
