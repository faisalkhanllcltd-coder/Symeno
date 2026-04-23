<script lang="ts">
  export let orders: any[] = [];
  let searchQuery = '';
  
  $: filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center gap-4 bg-[#111318] p-3 border border-white/10">
    <div class="relative w-full max-w-md">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
      </div>
      <input type="text" bind:value={searchQuery} placeholder="Search Order ID or Customer..." class="w-full bg-[#1A1D23] border border-white/10 text-white pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#36f4a4]/50 font-mono transition-colors rounded-none placeholder:text-white/30" />
    </div>
    <div class="text-[10px] font-mono text-white/50 uppercase tracking-widest">
      Showing {filteredOrders.length} Records
    </div>
  </div>

  <div class="bg-[#111318] border border-white/10 overflow-x-auto">
    <table class="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr class="bg-white/[0.02] border-b border-white/10 text-[10px] uppercase tracking-widest text-white/50 font-mono">
          <th class="px-4 py-3 font-semibold">Order ID</th>
          <th class="px-4 py-3 font-semibold">Date</th>
          <th class="px-4 py-3 font-semibold">Customer</th>
          <th class="px-4 py-3 font-semibold text-right">Gross Total</th>
          <th class="px-4 py-3 font-semibold text-center">Status</th>
          <th class="px-4 py-3 font-semibold text-right">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.05] text-xs">
        {#each filteredOrders as order}
          <tr class="hover:bg-white/[0.02] transition-colors group">
            <td class="px-4 py-3 font-mono font-bold text-white">{order.id}</td>
            <td class="px-4 py-3 font-mono text-white/60">{order.date}</td>
            <td class="px-4 py-3 text-white">{order.customer}</td>
            <td class="px-4 py-3 font-mono text-right font-bold text-white">${order.total.toFixed(2)}</td>
            <td class="px-4 py-3 text-center">
              {#if order.status === 'Pending'}
                <span class="inline-block bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">Pending</span>
              {:else if order.status === 'Shipped'}
                <span class="inline-block bg-[#36f4a4]/10 text-[#36f4a4] border border-[#36f4a4]/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">Shipped</span>
              {/if}
            </td>
            <td class="px-4 py-3 text-right">
              <button class="text-[10px] font-mono text-white/40 hover:text-[#36f4a4] uppercase tracking-widest focus:outline-none transition-colors border-b border-transparent hover:border-[#36f4a4]">Process</button>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="6" class="px-4 py-12 text-center text-white/40 font-mono text-xs">
              No orders found matching criteria.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
