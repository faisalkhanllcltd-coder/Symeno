<script lang="ts">
  let { orders = [] } = $props<{ orders: any[] }>();
  
  let searchQuery = $state('');
  let statusFilter = $state('ALL');

  let filteredOrders = $derived(orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  }));

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'DELIVERED': return 'text-[#36f4a4] border-[#36f4a4]/30 bg-[#36f4a4]/10';
      case 'CANCELLED': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'RETURNED': return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default: return 'text-white/70 border-white/10 bg-white/5';
    }
  };
</script>

<div class="space-y-6">
  <div class="flex flex-col sm:flex-row justify-between gap-4 bg-[#111318] p-4 border border-white/10">
    <input type="text" bind:value={searchQuery} placeholder="Search Order ID..." class="w-full sm:w-72 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    <select bind:value={statusFilter} class="w-full sm:w-48 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono cursor-pointer">
      <option value="ALL">All Statuses</option>
      <option value="PENDING">Pending</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>
      <option value="CANCELLED">Cancelled</option>
    </select>
  </div>

  <div class="space-y-4">
    {#each filteredOrders as order}
      <div class="bg-[#111318] border border-white/10 hover:border-white/20 transition-colors">
        <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div class="flex items-center gap-4">
            <span class="text-xs font-bold text-white font-mono">#{order.id.substring(0,8).toUpperCase()}</span>
            <span class="text-[9px] px-2 py-0.5 uppercase tracking-widest border {getStatusColor(order.status)}">{order.status}</span>
          </div>
          <span class="text-[10px] font-mono text-white/50">{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        <div class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-[#0a0b0e] border border-white/10 flex items-center justify-center">
               <svg class="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-1">Total Amount</p>
              <p class="text-lg font-bold text-[#36f4a4] font-mono">${order.total.toFixed(2)}</p>
            </div>
          </div>
          
          <div class="flex flex-col gap-2 w-full sm:w-48">
            <a href={`/account/orders/${order.id}`} class="text-center px-4 py-2 border border-white/10 text-white/80 hover:bg-white/5 text-[10px] font-mono uppercase tracking-widest transition-colors w-full">View Details</a>
            {#if order.tracking_url}
              <a href={order.tracking_url} target="_blank" class="text-center px-4 py-2 bg-[#36f4a4] text-[#003822] hover:bg-white text-[10px] font-bold font-mono uppercase tracking-widest transition-colors w-full">Track Package</a>
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="bg-[#111318] p-12 border border-white/10 text-center">
        <p class="text-xs font-mono text-white/40 uppercase">No orders match the current criteria.</p>
      </div>
    {/each}
  </div>
</div>