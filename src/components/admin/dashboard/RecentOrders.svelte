<script lang="ts">
  let { orders = [] } = $props<{ orders?: any[] }>();
</script>

<div
  class="flex h-full flex-col overflow-hidden border border-outline bg-surface"
>
  <div class="border-b border-outline p-4">
    <h3
      class="font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Recent Transactions
    </h3>
  </div>
  <div class="flex-1 overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <tbody>
        {#each orders as order}
          <tr
            class="border-b border-outline transition-colors hover:bg-white/[0.02]"
          >
            <td class="p-4 font-mono text-xs text-content-muted"
              ><a
                href={`/admin/orders/${order.id}`}
                class="hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm">{order.id}</a
              ></td
            >
            <td class="p-4 font-mono text-xs text-content-muted"
              >{order.customer_email}</td
            >
            <td class="p-4 font-mono text-xs font-bold text-brand"
              >${(order.total || 0).toFixed(2)}</td
            >
            <td class="p-4 text-right">
              <span
                class="border border-outline px-2 py-1 text-[9px] tracking-widest text-content-muted uppercase"
                >{order.status}</span
              >
            </td>
          </tr>
        {:else}
          <tr
            ><td
              colspan="4"
              class="p-8 text-center text-[10px] font-mono text-content-muted uppercase"
              >No recent orders.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
