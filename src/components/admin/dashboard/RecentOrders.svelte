<script lang="ts">
  let { orders = [] } = $props<{ orders: any[] }>();
</script>

<div class="bg-[#111318] border border-white/10 overflow-hidden flex flex-col h-full">
  <div class="p-4 border-b border-white/10">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono">Recent Transactions</h3>
  </div>
  <div class="overflow-x-auto flex-1">
    <table class="w-full text-left border-collapse">
      <tbody>
        {#each orders as order}
          <tr class="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
            <td class="p-4 text-xs font-mono text-white/80"><a href={`/admin/orders/${order.id}`} class="hover:text-[#36f4a4]">{order.id}</a></td>
            <td class="p-4 text-xs font-mono text-white/50">{order.customer_email}</td>
            <td class="p-4 text-xs font-mono text-[#36f4a4] font-bold">${(order.total || 0).toFixed(2)}</td>
            <td class="p-4 text-right">
              <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-white/10 text-white/70">{order.status}</span>
            </td>
          </tr>
        {:else}
          <tr><td colspan="4" class="p-8 text-center text-[10px] font-mono text-white/30 uppercase">No recent orders.</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>