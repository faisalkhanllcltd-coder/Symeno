<script lang="ts">
  let { orders = [] } = $props<{ orders: any[] }>();
</script>

<div class="bg-[#111318] border border-white/10">
  <div class="p-4 border-b border-white/10 flex justify-between items-center">
    <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono">Recent Operations</h3>
    {#if orders.length > 0}
      <a href="/account/orders" class="text-[10px] text-white/50 hover:text-[#36f4a4] font-mono uppercase transition-colors">View Ledger &rarr;</a>
    {/if}
  </div>
  
  <div class="divide-y divide-white/5">
    {#each orders as order}
      <div class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.02] transition-colors">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <span class="text-sm font-bold text-white font-mono">#{order.id.substring(0,8).toUpperCase()}</span>
            <span class="text-[9px] px-2 py-0.5 border border-white/10 text-white/70 uppercase tracking-widest">{order.status}</span>
          </div>
          <p class="text-[10px] font-mono text-white/40">{new Date(order.created_at).toLocaleDateString()} • ${order.total.toFixed(2)}</p>
        </div>
        <div class="flex gap-3 w-full sm:w-auto">
          <a href={`/account/orders/${order.id}`} class="flex-1 sm:flex-none text-center px-4 py-2 border border-white/10 text-white/70 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-colors">Details</a>
          {#if order.tracking_url}
            <a href={order.tracking_url} target="_blank" class="flex-1 sm:flex-none text-center px-4 py-2 bg-[#36f4a4]/10 text-[#36f4a4] border border-[#36f4a4]/30 hover:bg-[#36f4a4]/20 text-[10px] font-mono uppercase tracking-widest transition-colors">Track</a>
          {/if}
        </div>
      </div>
    {:else}
      <div class="p-8 text-center">
        <p class="text-[10px] font-mono text-white/30 uppercase mb-4">No active operations found.</p>
        <a href="/shop" class="inline-block border border-[#36f4a4]/30 text-[#36f4a4] px-6 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-[#36f4a4]/10 transition-colors">Explore Matrix</a>
      </div>
    {/each}
  </div>
</div>