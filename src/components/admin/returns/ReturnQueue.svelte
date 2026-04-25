<script lang="ts">
  let { rmas = [] } = $props<{ rmas?: any[] }>();
</script>

<div class="overflow-x-auto border border-outline bg-surface">
  <table class="w-full border-collapse text-left">
    <thead>
      <tr
        class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
      >
        <th class="p-4 font-normal">Order / RMA ID</th>
        <th class="p-4 font-normal">Customer</th>
        <th class="p-4 text-right font-normal">Refund Value</th>
        <th class="p-4 text-center font-normal">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-outline">
      {#each rmas as rma}
        <tr class="transition-colors hover:bg-white/[0.02]">
          <td class="p-4 font-mono text-xs text-brand"
            ><a class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm" href={`/admin/orders/${rma.id}`}>{rma.id}</a></td
          >
          <td class="p-4 font-mono text-xs text-content-muted"
            >{rma.customer_email}</td
          >
          <td class="p-4 text-right font-mono text-xs text-content"
            >${rma.total}</td
          >
          <td class="p-4 text-center">
            <a
              href={`/admin/orders/${rma.id}`}
              class="border border-outline px-3 py-1 font-mono text-[10px] tracking-widest text-content uppercase hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >Process</a
            >
          </td>
        </tr>
      {:else}
        <tr
          ><td
            colspan="4"
            class="p-8 text-center text-xs font-mono text-content-muted uppercase"
            >No active return requests.</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>
