<script lang="ts">
  let { rmas = [] } = $props<{ rmas: any[] }>();
</script>

<div class="bg-[#111318] border border-white/10 overflow-x-auto">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
        <th class="p-4 font-normal">Order / RMA ID</th>
        <th class="p-4 font-normal">Customer</th>
        <th class="p-4 font-normal text-right">Refund Value</th>
        <th class="p-4 font-normal text-center">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/[0.04]">
      {#each rmas as rma}
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="p-4 text-xs font-mono text-[#36f4a4]"><a href={`/admin/orders/${rma.id}`}>{rma.id}</a></td>
          <td class="p-4 text-xs font-mono text-white/70">{rma.customer_email}</td>
          <td class="p-4 text-xs font-mono text-white text-right">${rma.total}</td>
          <td class="p-4 text-center">
            <a href={`/admin/orders/${rma.id}`} class="text-[10px] border border-white/10 px-3 py-1 font-mono uppercase tracking-widest hover:bg-white/10 text-white">Process</a>
          </td>
        </tr>
      {:else}
        <tr><td colspan="4" class="p-8 text-center text-xs font-mono text-white/30 uppercase">No active return requests.</td></tr>
      {/each}
    </tbody>
  </table>
</div>