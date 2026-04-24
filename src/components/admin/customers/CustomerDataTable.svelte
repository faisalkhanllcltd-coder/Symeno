<script lang="ts">
  import CustomerSegmentBadge from './CustomerSegmentBadge.svelte';

  let { customers = [] } = $props<{ customers: any[] }>();
  let searchQuery = $state('');

  let filteredCustomers = $derived(
    customers.filter(
      (c) =>
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getSegment = (c: any) => {
    if (c.total_spent > 5000 || c.order_count > 5) return 'VIP';
    if (c.role === 'wholesale') return 'Wholesale';
    if (
      c.order_count === 0 &&
      new Date().getTime() - new Date(c.created_at).getTime() < 2592000000
    )
      return 'New';
    return 'Standard';
  };
</script>

<div class="space-y-4">
  <div
    class="flex items-center justify-between border border-white/10 bg-[#111318] p-4"
  >
    <div class="relative w-72">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search email or name..."
        class="w-full border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white placeholder:text-white/30 focus:border-[#36f4a4]/50 focus:outline-none"
      />
    </div>
    <button
      class="border border-white/10 px-4 py-2 font-mono text-[10px] tracking-widest text-white/70 uppercase transition-colors hover:text-white"
      >Export CSV</button
    >
  </div>

  <div class="overflow-x-auto border border-white/10 bg-[#111318]">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
        >
          <th class="p-4 font-normal">Customer</th>
          <th class="p-4 font-normal">Segment</th>
          <th class="p-4 text-right font-normal">Orders</th>
          <th class="p-4 text-right font-normal">Lifetime Value</th>
          <th class="p-4 font-normal">Joined</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each filteredCustomers as c}
          <tr class="group transition-colors hover:bg-white/[0.02]">
            <td class="p-4">
              <a
                href={`/admin/customers/${c.id}`}
                class="block transition-colors group-hover:text-[#36f4a4]"
              >
                <div class="text-xs font-bold text-white">
                  {c.first_name}
                  {c.last_name}
                </div>
                <div class="mt-0.5 font-mono text-[10px] text-white/50">
                  {c.email}
                </div>
              </a>
            </td>
            <td class="p-4"><CustomerSegmentBadge segment={getSegment(c)} /></td
            >
            <td class="p-4 text-right font-mono text-xs text-white/80"
              >{c.order_count || 0}</td
            >
            <td
              class="p-4 text-right font-mono text-xs font-bold text-[#36f4a4]"
              >${(c.total_spent || 0).toLocaleString()}</td
            >
            <td class="p-4 font-mono text-[10px] text-white/40"
              >{new Date(c.created_at).toLocaleDateString()}</td
            >
          </tr>
        {:else}
          <tr
            ><td
              colspan="5"
              class="p-8 text-center text-xs font-mono text-white/30 uppercase"
              >No customers found.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
