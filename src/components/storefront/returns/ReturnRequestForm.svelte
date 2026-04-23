<script lang="ts">
  let { recentOrders = [] } = $props<{ recentOrders: any[] }>();
  
  let step = $state(1);
  let selectedOrder = $state('');
  let selectedItems = $state<any[]>([]);
  let resolution = $state('refund');
  let isSubmitting = $state(false);
  let rmaResult = $state<string | null>(null);

  // Mock items loaded when an order is selected
  let orderItems = $derived(() => {
    if (!selectedOrder) return [];
    return [
      { id: 'item_1', name: 'Symeno Operator Keyboard', price: 149.99, reason: '', photoUrl: '' },
      { id: 'item_2', name: 'Tactile Switches (90x)', price: 45.00, reason: '', photoUrl: '' }
    ];
  });

  const reasons = [
    'Wrong size or fit',
    'Item was damaged or defective',
    'Not as described online',
    'Changed my mind'
  ];

  function toggleItem(item: any) {
    const exists = selectedItems.find(i => i.id === item.id);
    if (exists) {
      selectedItems = selectedItems.filter(i => i.id !== item.id);
    } else {
      selectedItems = [...selectedItems, { ...item }];
    }
  }

  function updateItemReason(id: string, reason: string) {
    const index = selectedItems.findIndex(i => i.id === id);
    if (index !== -1) selectedItems[index].reason = reason;
  }

  async function submitRMA(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      const res = await fetch('/api/account/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder, items: selectedItems, resolution })
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

<div class="bg-[#111318] border border-white/10 p-6 md:p-8 max-w-3xl mx-auto">
  
  <div class="flex items-center justify-between mb-8 relative">
    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-white/10 z-0"></div>
    {#each [1, 2, 3] as s}
      <div class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono {step >= s ? 'bg-[#36f4a4] text-black font-bold' : 'bg-[#1A1D23] border border-white/20 text-white/50'}">
        {s}
      </div>
    {/each}
  </div>

  <form onsubmit={submitRMA}>
    
    {#if step === 1}
      <div class="space-y-6 animate-fade-in">
        <h2 class="text-lg font-bold text-white uppercase tracking-widest">Select Transaction</h2>
        <p class="text-xs text-white/50 font-mono mb-4">Choose the order containing the items you wish to return.</p>
        
        <div class="space-y-3">
          {#each recentOrders as order}
            <label class="flex items-center gap-4 p-4 border cursor-pointer transition-colors {selectedOrder === order.id ? 'border-[#36f4a4] bg-[#36f4a4]/5' : 'border-white/10 bg-[#1A1D23] hover:border-white/30'}">
              <input type="radio" name="order" value={order.id} bind:group={selectedOrder} class="accent-[#36f4a4] w-4 h-4" />
              <div class="flex-1">
                <div class="flex justify-between items-center mb-1">
                  <span class="text-xs font-bold text-white font-mono">#{order.id.substring(0,8)}</span>
                  <span class="text-[10px] font-mono text-[#36f4a4]">${order.total.toFixed(2)}</span>
                </div>
                <span class="text-[10px] text-white/40 font-mono">Placed on {new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </label>
          {:else}
            <div class="p-8 text-center border border-white/10">
              <p class="text-xs font-mono text-white/40 uppercase">No eligible orders found within the 14-day return window.</p>
            </div>
          {/each}
        </div>
        
        <div class="flex justify-end pt-4">
          <button type="button" disabled={!selectedOrder} onclick={() => step = 2} class="bg-[#36f4a4] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors">Continue</button>
        </div>
      </div>
    {/if}

    {#if step === 2}
      <div class="space-y-6 animate-fade-in">
        <h2 class="text-lg font-bold text-white uppercase tracking-widest">Select Items</h2>
        
        <div class="space-y-4">
          {#each orderItems() as item}
            <div class="p-4 border border-white/10 bg-[#1A1D23]">
              <label class="flex items-center gap-4 cursor-pointer mb-4">
                <input type="checkbox" checked={selectedItems.some(i => i.id === item.id)} onchange={() => toggleItem(item)} class="accent-[#36f4a4] w-4 h-4" />
                <div class="flex-1 flex justify-between">
                  <span class="text-xs font-bold text-white">{item.name}</span>
                  <span class="text-xs font-mono text-white/70">${item.price.toFixed(2)}</span>
                </div>
              </label>
              
              {#if selectedItems.some(i => i.id === item.id)}
                <div class="pl-8 space-y-4 pt-4 border-t border-white/10 mt-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Reason for Return</label>
                    <select onchange={(e) => updateItemReason(item.id, e.target.value)} class="w-full bg-[#111318] border border-white/10 text-white p-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono">
                      <option value="" disabled selected>Select a reason...</option>
                      {#each reasons as r}
                        <option value={r}>{r}</option>
                      {/each}
                    </select>
                  </div>
                  
                  {#if selectedItems.find(i => i.id === item.id)?.reason === 'Item was damaged or defective'}
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-widest text-rose-400 font-mono mb-2">Upload Photographic Proof (Required)</label>
                      <input type="file" accept="image/*" class="w-full text-xs text-white/50 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-mono file:uppercase file:bg-rose-500/10 file:text-rose-400 hover:file:bg-rose-500/20" />
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <div class="flex justify-between pt-4">
          <button type="button" onclick={() => step = 1} class="border border-white/10 text-white/70 px-6 py-3 text-xs font-mono uppercase tracking-widest hover:text-white transition-colors">Back</button>
          <button type="button" disabled={selectedItems.length === 0 || selectedItems.some(i => !i.reason)} onclick={() => step = 3} class="bg-[#36f4a4] text-black px-8 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors">Review Details</button>
        </div>
      </div>
    {/if}

    {#if step === 3}
      <div class="space-y-6 animate-fade-in">
        <h2 class="text-lg font-bold text-white uppercase tracking-widest">Resolution Request</h2>
        
        <div class="flex gap-4">
          <label class="flex-1 p-4 border cursor-pointer transition-colors {resolution === 'refund' ? 'border-[#36f4a4] bg-[#36f4a4]/5' : 'border-white/10 bg-[#1A1D23] hover:border-white/30'}">
            <input type="radio" value="refund" bind:group={resolution} class="hidden" />
            <div class="text-center">
              <svg class="w-6 h-6 mx-auto mb-2 {resolution === 'refund' ? 'text-[#36f4a4]' : 'text-white/30'}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 class="text-xs font-bold text-white uppercase tracking-widest">Original Payment Method</h3>
              <p class="text-[9px] font-mono text-white/50 mt-1">Refund processed in 5-7 business days.</p>
            </div>
          </label>
          <label class="flex-1 p-4 border cursor-pointer transition-colors {resolution === 'exchange' ? 'border-[#36f4a4] bg-[#36f4a4]/5' : 'border-white/10 bg-[#1A1D23] hover:border-white/30'}">
            <input type="radio" value="exchange" bind:group={resolution} class="hidden" />
            <div class="text-center">
              <svg class="w-6 h-6 mx-auto mb-2 {resolution === 'exchange' ? 'text-[#36f4a4]' : 'text-white/30'}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              <h3 class="text-xs font-bold text-white uppercase tracking-widest">Store Credit / Exchange</h3>
              <p class="text-[9px] font-mono text-white/50 mt-1">Instant credit issued upon drop-off.</p>
            </div>
          </label>
        </div>

        <div class="bg-amber-500/10 border border-amber-500/30 p-4">
          <p class="text-[10px] font-mono text-amber-400">By submitting this request, you agree to our Return Policy. Items must be shipped back within 14 days of label generation to avoid cancellation.</p>
        </div>

        <div class="flex justify-between pt-4">
          <button type="button" onclick={() => step = 2} class="border border-white/10 text-white/70 px-6 py-3 text-xs font-mono uppercase tracking-widest hover:text-white transition-colors">Back</button>
          <button type="submit" disabled={isSubmitting} class="bg-[#36f4a4] text-[#003822] px-8 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(54,244,164,0.15)]">
            {isSubmitting ? 'Authorizing...' : 'Submit Request'}
          </button>
        </div>
      </div>
    {/if}

    {#if step === 4}
      <div class="text-center space-y-6 animate-fade-in py-8">
        <div class="w-16 h-16 rounded-full border-2 border-[#36f4a4] flex items-center justify-center mx-auto bg-[#36f4a4]/10">
          <svg class="w-8 h-8 text-[#36f4a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-white uppercase tracking-widest">RMA Authorized</h2>
          <p class="text-xs text-[#36f4a4] font-mono mt-2">Authorization Code: RMA-{rmaResult?.substring(0,6).toUpperCase()}</p>
        </div>
        <p class="text-[10px] font-mono text-white/50 max-w-md mx-auto">Your return request has been submitted to the operations team. You will receive an email with your shipping label and further instructions within 24 hours.</p>
        <div class="pt-4">
          <a href="/account/returns" class="border border-white/10 text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">View Return Status</a>
        </div>
      </div>
    {/if}
  </form>
</div>