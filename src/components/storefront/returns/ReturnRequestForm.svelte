<script lang="ts">
  let { recentOrders = [] } = $props<{ recentOrders: any[] }>();

  let step = $state(1);
  let selectedOrder = $state('');
  let selectedItems = $state<any[]>([]);
  let resolution = $state('refund');
  let isSubmitting = $state(false);
  let rmaResult = $state<string | null>(null);

  // Dynamically fetched order items when an order is selected
  let orderItems = $state<any[]>([]);
  let loadingItems = $state(false);

  $effect(() => {
    if (!selectedOrder) {
      orderItems = [];
      return;
    }
    loadingItems = true;
    fetch(`/api/account/order-items?orderId=${encodeURIComponent(selectedOrder)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        orderItems = Array.isArray(data) ? data.map((item: any) => ({
          id: item.id,
          name: item.title || item.name || 'Unknown Item',
          price: Number(item.unit_price || item.locked_price || 0),
          reason: '',
          photoUrl: '',
        })) : [];
      })
      .catch(() => { orderItems = []; })
      .finally(() => { loadingItems = false; });
  });


  const reasons = [
    'Wrong size or fit',
    'Item was damaged or defective',
    'Not as described online',
    'Changed my mind',
  ];

  function toggleItem(item: any) {
    if (isSubmitting) return;
    const exists = selectedItems.find((i) => i.id === item.id);
    if (exists) {
      selectedItems = selectedItems.filter((i) => i.id !== item.id);
    } else {
      selectedItems = [...selectedItems, { ...item }];
    }
  }

  function updateItemReason(id: string, reason: string) {
    if (isSubmitting) return;
    const index = selectedItems.findIndex((i) => i.id === id);
    if (index !== -1) selectedItems[index].reason = reason;
  }

  async function submitRMA(e: Event) {
    e.preventDefault();
    if (isSubmitting) return;

    isSubmitting = true;
    
    try {
      const res = await fetch('/api/account/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: selectedOrder,
          items: selectedItems,
          resolution
        }),
      });
      if (res.ok) {
        const data = await res.json();
        rmaResult = data.rma_id;
        step = 4; // Success Screen
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<div class="mx-auto max-w-3xl border border-outline bg-base p-6 md:p-8">
  <div class="relative mb-8 flex items-center justify-between">
    <div class="absolute top-1/2 left-0 z-0 h-px w-full -translate-y-1/2 bg-outline"></div>
    {#each [1, 2, 3] as s}
      <div
        class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs {step >= s ? 'bg-brand font-bold text-brand-dark' : 'border border-outline bg-surface text-content-muted'}"
      >
        {s}
      </div>
    {/each}
  </div>

  <form onsubmit={submitRMA} data-secured="true">
    {#if step === 1}
      <div class="animate-fade-in space-y-6">
        <h2 class="text-lg font-bold tracking-widest text-content uppercase">        
          Select Transaction
        </h2>
        <p class="mb-4 font-mono text-xs text-content-muted">
          Choose the order containing the items you wish to return.
        </p>

        <div class="space-y-3">
          {#each recentOrders as order}
            <label
              class="flex cursor-pointer items-center gap-4 border p-4 transition-colors {selectedOrder === order.id ? 'border-brand bg-brand/5' : 'border-outline bg-surface hover:border-content-muted'} {isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}"
            >
              <input
                type="radio"
                name="order"
                value={order.id}
                bind:group={selectedOrder}
                disabled={isSubmitting}
                class="h-4 w-4 accent-brand disabled:cursor-not-allowed"
              />
              <div class="flex-1">
                <div class="mb-1 flex items-center justify-between">
                  <span class="font-mono text-xs font-bold text-content">#{order.id.substring(0, 8)}</span>
                  <span class="font-mono text-[10px] text-brand">${order.total.toFixed(2)}</span>
                </div>
                <span class="font-mono text-[10px] text-content-muted">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </label>
          {:else}
            <div class="p-8 text-center border border-outline">
              <p class="text-xs font-mono text-content-muted uppercase">
                No eligible orders found within the 14-day return window.
              </p>
            </div>
          {/each}
        </div>

        <div class="flex justify-end pt-4">
          <button
            type="button"
            disabled={!selectedOrder || isSubmitting}
            onclick={() => (step = 2)}
            class="bg-brand px-8 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
            >Continue</button>
        </div>
      </div>
    {/if}

    {#if step === 2}
      <div class="animate-fade-in space-y-6">
        <h2 class="text-lg font-bold tracking-widest text-content uppercase">        
          Select Items
        </h2>

        <div class="space-y-4">
          {#each orderItems as item}
            <div class="border border-outline bg-surface p-4 {isSubmitting ? 'opacity-70' : ''}">
              <label class="mb-4 flex cursor-pointer items-center gap-4 {isSubmitting ? 'cursor-not-allowed' : ''}">
                <input
                  type="checkbox"
                  checked={selectedItems.some((i) => i.id === item.id)}
                  onchange={() => toggleItem(item)}
                  disabled={isSubmitting}
                  class="h-4 w-4 accent-brand disabled:cursor-not-allowed"
                />
                <div class="flex flex-1 justify-between">
                  <span class="text-xs font-bold text-content">{item.name}</span>   
                  <span class="font-mono text-xs text-content-muted">${item.price.toFixed(2)}</span>
                </div>
              </label>

              {#if selectedItems.some((i) => i.id === item.id)}
                <div class="mt-4 space-y-4 border-t border-outline pt-4 pl-8">      
                  <div>
                    <label class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase">Reason for Return</label>
                    <select
                      onchange={(e) => updateItemReason(item.id, (e.target as HTMLSelectElement).value)}
                      disabled={isSubmitting}
                      class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled selected>Select a reason...</option>
                      {#each reasons as r}
                        <option value={r} selected={selectedItems.find((i) => i.id === item.id)?.reason === r}>{r}</option>
                      {/each}
                    </select>
                  </div>

                  {#if selectedItems.find((i) => i.id === item.id)?.reason === 'Item was damaged or defective'}
                    <div>
                      <label class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-brand-alert uppercase">Upload Photographic Proof (Required)</label>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isSubmitting}
                        class="w-full text-xs text-content-muted file:mr-4 file:border-0 file:bg-brand-alert/10 file:px-4 file:py-2 file:font-mono file:text-xs file:text-brand-alert file:uppercase hover:file:bg-brand-alert/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <div class="flex justify-between pt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onclick={() => (step = 1)}
            class="border border-outline px-6 py-3 font-mono text-xs tracking-widest text-content-muted uppercase transition-colors hover:text-content disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >Back</button>
          <button
            type="button"
            disabled={selectedItems.length === 0 || selectedItems.some((i) => !i.reason) || isSubmitting}
            onclick={() => (step = 3)}
            class="bg-brand px-8 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
            >Review Details</button>
        </div>
      </div>
    {/if}

    {#if step === 3}
      <div class="animate-fade-in space-y-6">
        <h2 class="text-lg font-bold tracking-widest text-content uppercase">        
          Resolution Request
        </h2>

        <div class="flex gap-4">
          <label class="flex-1 cursor-pointer border p-4 transition-colors {resolution === 'refund' ? 'border-brand bg-brand/5' : 'border-outline bg-surface hover:border-content-muted'} {isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}">
            <input type="radio" value="refund" bind:group={resolution} disabled={isSubmitting} class="hidden" />
            <div class="text-center">
              <svg class="mx-auto mb-2 h-6 w-6 {resolution === 'refund' ? 'text-brand' : 'text-content-muted'}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 class="text-xs font-bold tracking-widest text-content uppercase">Original Payment Method</h3>
              <p class="mt-1 font-mono text-[9px] text-content-muted">Refund processed in 5-7 business days.</p>
            </div>
          </label>
          <label class="flex-1 cursor-pointer border p-4 transition-colors {resolution === 'exchange' ? 'border-brand bg-brand/5' : 'border-outline bg-surface hover:border-content-muted'} {isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}">
            <input type="radio" value="exchange" bind:group={resolution} disabled={isSubmitting} class="hidden" />
            <div class="text-center">
              <svg class="mx-auto mb-2 h-6 w-6 {resolution === 'exchange' ? 'text-brand' : 'text-content-muted'}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              <h3 class="text-xs font-bold tracking-widest text-content uppercase">Store Credit / Exchange</h3>
              <p class="mt-1 font-mono text-[9px] text-content-muted">Instant credit issued upon drop-off.</p>
            </div>
          </label>
        </div>

        <div class="border border-amber-500/30 bg-amber-500/10 p-4">
          <p class="font-mono text-[10px] text-amber-400">
            By submitting this request, you agree to our Return Policy. Items        
            must be shipped back within 14 days of label generation to avoid        
            cancellation.
          </p>
        </div>


        <div class="flex justify-between pt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onclick={() => (step = 2)}
            class="border border-outline px-6 py-3 font-mono text-xs tracking-widest text-content-muted uppercase transition-colors hover:text-content disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >Back</button>
          <button
            type="submit"
            disabled={isSubmitting}
            class="bg-brand px-8 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase shadow-[0_0_15px_var(--color-brand,rgba(54,244,164,0.15))] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
          >
            {isSubmitting ? 'Authorizing...' : 'Submit Request'}
          </button>
        </div>
      </div>
    {/if}

    {#if step === 4}
      <div class="animate-fade-in space-y-6 py-8 text-center">
        <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand bg-brand/10">
          <svg class="h-8 w-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold tracking-widest text-content uppercase">      
            RMA Authorized
          </h2>
          <p class="mt-2 font-mono text-xs text-brand">
            Authorization Code: RMA-{rmaResult?.substring(0, 6).toUpperCase()}      
          </p>
        </div>
        <p class="mx-auto max-w-md font-mono text-[10px] text-content-muted">       
          Your return request has been submitted to the operations team. You        
          will receive an email with your shipping label and further
          instructions within 24 hours.
        </p>
        <div class="pt-4">
          <a href="/account/returns" class="border border-outline px-8 py-3 text-xs font-bold tracking-widest text-content uppercase transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm">View Return Status</a>
        </div>
      </div>
    {/if}
  </form>
</div>