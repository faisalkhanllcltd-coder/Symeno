<script lang="ts">
  let { rmas = [] } = $props<{ rmas: any[] }>();
</script>

<div class="overflow-x-auto border border-white/10 bg-[#111318]">
  <table class="w-full border-collapse text-left">
    <thead>
      <tr
        class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
      >
        <th class="p-4 font-normal">Order / RMA ID</th>
        <th class="p-4 font-normal">Customer</th>
        <th class="p-4 text-right font-normal">Refund Value</th>
        <th class="p-4 text-center font-normal">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/[0.04]">
      {#each rmas as rma}
        <tr class="transition-colors hover:bg-white/[0.02]">
          <td class="p-4 font-mono text-xs text-[#36f4a4]"
            ><a href={`/admin/orders/${rma.id}`}>{rma.id}</a></td
          >
          <td class="p-4 font-mono text-xs text-white/70"
            >{rma.customer_email}</td
          >
          <td class="p-4 text-right font-mono text-xs text-white"
            >${rma.total}</td
          >
          <td class="p-4 text-center">
            <a
              href={`/admin/orders/${rma.id}`}
              class="border border-white/10 px-3 py-1 font-mono text-[10px] tracking-widest text-white uppercase hover:bg-white/10"
              >Process</a
            >
          </td>
        </tr>
      {:else}
        <tr
          ><td
            colspan="4"
            class="p-8 text-center text-xs font-mono text-white/30 uppercase"
            >No active return requests.</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>
