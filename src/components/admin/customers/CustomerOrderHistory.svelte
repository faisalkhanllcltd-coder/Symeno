<script lang="ts">
  let { orders = [] } = $props<{ orders: any[] }>();
</script>

<div class="border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
  >
    Transaction Ledger
  </h3>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-white/10 font-mono text-[9px] tracking-widest text-white/40 uppercase"
        >
          <th class="py-2 font-normal">Order ID</th>
          <th class="py-2 font-normal">Date</th>
          <th class="py-2 font-normal">Status</th>
          <th class="py-2 text-right font-normal">Total</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5">
        {#each orders as order}
          <tr class="hover:bg-white/[0.02]">
            <td class="py-3 font-mono text-xs text-[#36f4a4]"
              ><a href={`/admin/orders/${order.id}`}>{order.id}</a></td
            >
            <td class="py-3 font-mono text-[10px] text-white/60"
              >{new Date(order.created_at).toLocaleDateString()}</td
            >
            <td class="py-3">
              <span
                class="border border-white/10 px-2 py-0.5 text-[9px] text-white/70 uppercase"
                >{order.status}</span
              >
            </td>
            <td class="py-3 text-right font-mono text-xs text-white"
              >${order.total.toFixed(2)}</td
            >
          </tr>
        {:else}
          <tr
            ><td
              colspan="4"
              class="py-6 text-center text-[10px] font-mono text-white/30 uppercase"
              >No historical orders.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
