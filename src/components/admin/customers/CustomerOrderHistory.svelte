<script lang="ts">
  let { orders = [] } = $props<{ orders?: any[] }>();
</script>

<div class="border border-outline bg-surface p-6">
  <h3
    class="mb-4 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Transaction Ledger
  </h3>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-outline font-mono text-[9px] tracking-widest text-content-muted uppercase"
        >
          <th class="py-2 font-normal">Order ID</th>
          <th class="py-2 font-normal">Date</th>
          <th class="py-2 font-normal">Status</th>
          <th class="py-2 text-right font-normal">Total</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline">
        {#each orders as order}
          <tr class="hover:bg-white/[0.02]">
            <td class="py-3 font-mono text-xs text-brand"
              ><a class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm" href={`/admin/orders/${order.id}`}>{order.id}</a></td
            >
            <td class="py-3 font-mono text-[10px] text-content-muted"
              >{new Date(order.created_at).toLocaleDateString()}</td
            >
            <td class="py-3">
              <span
                class="border border-outline px-2 py-0.5 text-[9px] text-content-muted uppercase"
                >{order.status}</span
              >
            </td>
            <td class="py-3 text-right font-mono text-xs text-content"
              >${order.total.toFixed(2)}</td
            >
          </tr>
        {:else}
          <tr
            ><td
              colspan="4"
              class="py-6 text-center text-[10px] font-mono text-content-muted uppercase"
              >No historical orders.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
