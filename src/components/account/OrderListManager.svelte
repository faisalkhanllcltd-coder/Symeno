<script lang="ts">
  let { orders = [] } = $props<{ orders?: any[] }>();    

  let searchQuery = $state('');
  let statusFilter = $state('ALL');

  let filteredOrders = $derived(
    orders.filter((o) => {
      const matchesSearch = o.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-brand border-brand/30 bg-brand/10';
      case 'CANCELLED':
        return 'text-brand-alert border-brand-alert/30 bg-brand-alert/10';
      case 'RETURNED':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-content-muted border-outline bg-base';
    }
  };
</script>

<div class="space-y-6 transition-colors duration-300">
  <div
    class="flex flex-col justify-between gap-4 border border-outline bg-surface p-4 sm:flex-row"
  >
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search Order ID..."
      class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors sm:w-72"
    />
    <select
      bind:value={statusFilter}
      class="w-full cursor-pointer border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors sm:w-48"     
    >
      <option value="ALL">All Statuses</option>
      <option value="PENDING">Pending</option>
      <option value="SHIPPED">Shipped</option>
      <option value="DELIVERED">Delivered</option>      
      <option value="CANCELLED">Cancelled</option>      
    </select>
  </div>

  <div class="space-y-4">
    {#each filteredOrders as order}
      <div
        class="border border-outline bg-surface transition-colors hover:border-content-muted shadow-sm"
      >
        <div
          class="flex items-center justify-between border-b border-outline bg-base/50 p-4"
        >
          <div class="flex items-center gap-4">
            <span class="font-mono text-xs font-bold text-content"
              >#{order.id.substring(0, 8).toUpperCase()}</span
            >
            <span
              class="border px-2 py-0.5 text-[9px] tracking-widest uppercase {getStatusColor(
                order.status
              )}">{order.status}</span
            >
          </div>
          <span class="font-mono text-[10px] text-content-muted"
            >{new Date(order.created_at).toLocaleDateString()}</span
          >
        </div>
        <div
          class="flex flex-col items-start justify-between gap-6 p-4 sm:flex-row sm:items-center"
        >
          <div class="flex items-center gap-4">
            <div
              class="flex h-16 w-16 items-center justify-center border border-outline bg-base"
            >
              <svg
                class="h-6 w-6 text-content-muted opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                ><path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                /></svg
              >
            </div>
            <div>
              <p
                class="mb-1 font-mono text-[10px] tracking-widest text-content-muted uppercase"
              >
                Total Amount
              </p>
              <p class="font-mono text-lg font-bold text-brand">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div class="flex w-full flex-col gap-2 sm:w-48">
            <a
              href={`/account/orders/${order.id}`}      
              class="w-full border border-outline px-4 py-2 text-center font-mono text-[10px] tracking-widest text-content uppercase transition-colors hover:bg-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >View Details</a
            >
            {#if order.tracking_url}
              <a
                href={order.tracking_url}
                target="_blank"
                class="w-full bg-brand px-4 py-2 text-center font-mono text-[10px] font-bold tracking-widest text-brand-dark uppercase transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
                >Track Package</a
              >
            {/if}
          </div>
        </div>
      </div>
    {:else}
      <div class="bg-surface p-12 border border-outline text-center">
        <p class="text-xs font-mono text-content-muted uppercase tracking-widest">
          No orders match the current criteria.
        </p>
      </div>
    {/each}
  </div>
</div>
