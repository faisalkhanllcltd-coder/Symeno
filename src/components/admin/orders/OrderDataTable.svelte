<script lang="ts">
  let { orders = [] } = $props<{ orders?: any[] }>();
  let searchQuery = $state('');

  let filteredOrders = $derived(
    orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
</script>

<div class="space-y-4">
  <div
    class="flex items-center justify-between gap-4 border border-outline bg-surface p-3"
  >
    <div class="relative w-full max-w-md">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <svg
          class="h-4 w-4 text-content-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          /></svg
        >
      </div>
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search Order ID or Customer..."
        class="w-full border border-outline bg-base py-2 pr-4 pl-9 font-mono text-xs text-content transition-colors placeholder:text-content-muted focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>
    <div class="font-mono text-[10px] tracking-widest text-content-muted uppercase">
      Showing {filteredOrders.length} Records
    </div>
  </div>

  <div class="overflow-x-auto border border-outline bg-surface">
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr
          class="border-b border-outline bg-base font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >
          <th class="px-4 py-3 font-semibold">Order ID</th>
          <th class="px-4 py-3 font-semibold">Date</th>
          <th class="px-4 py-3 font-semibold">Customer</th>
          <th class="px-4 py-3 text-right font-semibold">Gross Total</th>
          <th class="px-4 py-3 text-center font-semibold">Status</th>
          <th class="px-4 py-3 text-right font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline text-xs">
        {#each filteredOrders as order}
          <tr class="group transition-colors hover:bg-white/[0.02]">
            <td class="px-4 py-3 font-mono font-bold text-content">{order.id}</td>
            <td class="px-4 py-3 font-mono text-content-muted">{order.date}</td>
            <td class="px-4 py-3 text-content">{order.customer}</td>
            <td class="px-4 py-3 text-right font-mono font-bold text-content"
              >${order.total.toFixed(2)}</td
            >
            <td class="px-4 py-3 text-center">
              {#if order.status === 'Pending'}
                <span
                  class="inline-block border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-amber-400 uppercase"
                  >Pending</span
                >
              {:else if order.status === 'Shipped'}
                <span
                  class="inline-block border border-brand/20 bg-brand/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-brand uppercase"
                  >Shipped</span
                >
              {/if}
            </td>
            <td class="px-4 py-3 text-right">
              <button
                class="border-b border-transparent font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                >Process</button
              >
            </td>
          </tr>
        {:else}
          <tr>
            <td
              colspan="6"
              class="px-4 py-12 text-center text-content-muted font-mono text-xs"
            >
              No orders found matching criteria.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
