<script lang="ts">
  let { orders = [] } = $props<{ orders: any[] }>();
</script>

<div
  class="flex h-full flex-col overflow-hidden border border-white/10 bg-[#111318]"
>
  <div class="border-b border-white/10 p-4">
    <h3
      class="font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
    >
      Recent Transactions
    </h3>
  </div>
  <div class="flex-1 overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <tbody>
        {#each orders as order}
          <tr
            class="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]"
          >
            <td class="p-4 font-mono text-xs text-white/80"
              ><a
                href={`/admin/orders/${order.id}`}
                class="hover:text-[#36f4a4]">{order.id}</a
              ></td
            >
            <td class="p-4 font-mono text-xs text-white/50"
              >{order.customer_email}</td
            >
            <td class="p-4 font-mono text-xs font-bold text-[#36f4a4]"
              >${(order.total || 0).toFixed(2)}</td
            >
            <td class="p-4 text-right">
              <span
                class="border border-white/10 px-2 py-1 text-[9px] tracking-widest text-white/70 uppercase"
                >{order.status}</span
              >
            </td>
          </tr>
        {:else}
          <tr
            ><td
              colspan="4"
              class="p-8 text-center text-[10px] font-mono text-white/30 uppercase"
              >No recent orders.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
