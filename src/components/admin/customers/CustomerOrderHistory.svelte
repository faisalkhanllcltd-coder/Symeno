<script lang="ts">
  let { orders = [] } = $props<{ orders: any[] }>();
</script>

<div class="bg-[#111318] p-6 border border-white/10">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-4">Transaction Ledger</h3>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="border-b border-white/10 text-[9px] font-mono uppercase tracking-widest text-white/40">
          <th class="py-2 font-normal">Order ID</th>
          <th class="py-2 font-normal">Date</th>
          <th class="py-2 font-normal">Status</th>
          <th class="py-2 font-normal text-right">Total</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        {#each orders as order}
          <tr class="hover:bg-white/[0.02]">
            <td class="py-3 text-xs font-mono text-[#36f4a4]"><a href={`/admin/orders/${order.id}`}>{order.id}</a></td>
            <td class="py-3 text-[10px] font-mono text-white/60">{new Date(order.created_at).toLocaleDateString()}</td>
            <td class="py-3">
              <span class="text-[9px] px-2 py-0.5 border border-white/10 text-white/70 uppercase">{order.status}</span>
            </td>
            <td class="py-3 text-xs font-mono text-white text-right">${order.total.toFixed(2)}</td>
          </tr>
        {:else}
          <tr><td colspan="4" class="py-6 text-center text-[10px] font-mono text-white/30 uppercase">No historical orders.</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>