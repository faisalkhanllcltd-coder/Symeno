<script lang="ts">
  let { orders = [] } = $props<{ orders?: any[] }>();    
</script>

<div class="border border-outline bg-surface">        
  <div class="flex items-center justify-between border-b border-outline p-4">
    <h3
      class="font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      Recent Operations
    </h3>
    {#if orders.length > 0}
      <a
        href="/account/orders"
        class="font-mono text-[10px] text-content-muted uppercase transition-colors hover:text-brand focus-visible:outline-none focus-visible:text-brand"
        >View Ledger &rarr;</a
      >
    {/if}
  </div>

  <div class="divide-y divide-outline">
    {#each orders as order}
      <div
        class="flex flex-col items-start justify-between gap-4 p-4 transition-colors hover:bg-base sm:flex-row sm:items-center"
      >
        <div>
          <div class="mb-1 flex items-center gap-3">    
            <span class="font-mono text-sm font-bold text-content"
              >#{order.id.substring(0, 8).toUpperCase()}</span
            >
            <span
              class="border border-outline px-2 py-0.5 text-[9px] tracking-widest text-content-muted uppercase"     
              >{order.status}</span
            >
          </div>
          <p class="font-mono text-[10px] text-content-muted">
            {new Date(order.created_at).toLocaleDateString()} • ${order.total_amount.toFixed(
              2
            )}
          </p>
        </div>
        <div class="flex w-full gap-3 sm:w-auto">        
          <a
            href={`/account/orders/${order.id}`}        
            class="flex-1 border border-outline px-4 py-2 text-center font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm sm:flex-none"
            >Details</a
          >
          {#if order.tracking_url}
            <a
              href={order.tracking_url}
              target="_blank"
              class="flex-1 border border-brand/30 bg-brand/10 px-4 py-2 text-center font-mono text-[10px] tracking-widest text-brand uppercase transition-colors hover:bg-brand/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm sm:flex-none"
              >Track</a
            >
          {/if}
        </div>
      </div>
    {:else}
      <div class="p-8 text-center">
        <p class="text-[10px] font-mono text-content-muted uppercase mb-4 tracking-widest">
          No active operations found.
        </p>
        <a
          href="/shop"
          class="inline-block border border-brand/30 text-brand px-6 py-2 text-[10px] font-mono uppercase tracking-widest hover:bg-brand/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          >Explore Matrix</a
        >
      </div>
    {/each}
  </div>
</div>
