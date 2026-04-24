<script lang="ts">
  export let orders: any[] = [];
  let searchQuery = '';

  $: filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );
</script>

<div class="space-y-4">
  <div
    class="flex items-center justify-between gap-4 border border-white/10 bg-[#111318] p-3"
  >
    <div class="relative w-full max-w-md">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <svg
          class="h-4 w-4 text-white/40"
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
        class="w-full rounded-none border border-white/10 bg-[#1A1D23] py-2 pr-4 pl-9 font-mono text-xs text-white transition-colors placeholder:text-white/30 focus:border-[#36f4a4]/50 focus:outline-none"
      />
    </div>
    <div class="font-mono text-[10px] tracking-widest text-white/50 uppercase">
      Showing {filteredOrders.length} Records
    </div>
  </div>

  <div class="overflow-x-auto border border-white/10 bg-[#111318]">
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr
          class="border-b border-white/10 bg-white/[0.02] font-mono text-[10px] tracking-widest text-white/50 uppercase"
        >
          <th class="px-4 py-3 font-semibold">Order ID</th>
          <th class="px-4 py-3 font-semibold">Date</th>
          <th class="px-4 py-3 font-semibold">Customer</th>
          <th class="px-4 py-3 text-right font-semibold">Gross Total</th>
          <th class="px-4 py-3 text-center font-semibold">Status</th>
          <th class="px-4 py-3 text-right font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.05] text-xs">
        {#each filteredOrders as order}
          <tr class="group transition-colors hover:bg-white/[0.02]">
            <td class="px-4 py-3 font-mono font-bold text-white">{order.id}</td>
            <td class="px-4 py-3 font-mono text-white/60">{order.date}</td>
            <td class="px-4 py-3 text-white">{order.customer}</td>
            <td class="px-4 py-3 text-right font-mono font-bold text-white"
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
                  class="inline-block border border-[#36f4a4]/20 bg-[#36f4a4]/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#36f4a4] uppercase"
                  >Shipped</span
                >
              {/if}
            </td>
            <td class="px-4 py-3 text-right">
              <button
                class="border-b border-transparent font-mono text-[10px] tracking-widest text-white/40 uppercase transition-colors hover:border-[#36f4a4] hover:text-[#36f4a4] focus:outline-none"
                >Process</button
              >
            </td>
          </tr>
        {:else}
          <tr>
            <td
              colspan="6"
              class="px-4 py-12 text-center text-white/40 font-mono text-xs"
            >
              No orders found matching criteria.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
