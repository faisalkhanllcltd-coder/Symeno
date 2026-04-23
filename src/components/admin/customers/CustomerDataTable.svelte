<script lang="ts">
  import CustomerSegmentBadge from './CustomerSegmentBadge.svelte';

  let { customers = [] } = $props<{ customers: any[] }>();
  let searchQuery = $state('');
  
  let filteredCustomers = $derived(customers.filter(c => 
    (c.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.first_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.last_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  ));

  const getSegment = (c: any) => {
    if (c.total_spent > 5000 || c.order_count > 5) return 'VIP';
    if (c.role === 'wholesale') return 'Wholesale';
    if (c.order_count === 0 && (new Date().getTime() - new Date(c.created_at).getTime()) < 2592000000) return 'New';
    return 'Standard';
  };
</script>

<div class="space-y-4">
  <div class="flex justify-between items-center bg-[#111318] p-4 border border-white/10">
    <div class="relative w-72">
      <input type="text" bind:value={searchQuery} placeholder="Search email or name..." class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono placeholder:text-white/30" />
    </div>
    <button class="border border-white/10 text-white/70 hover:text-white px-4 py-2 text-[10px] font-mono uppercase tracking-widest transition-colors">Export CSV</button>
  </div>

  <div class="bg-[#111318] border border-white/10 overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <th class="p-4 font-normal">Customer</th>
          <th class="p-4 font-normal">Segment</th>
          <th class="p-4 font-normal text-right">Orders</th>
          <th class="p-4 font-normal text-right">Lifetime Value</th>
          <th class="p-4 font-normal">Joined</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each filteredCustomers as c}
          <tr class="hover:bg-white/[0.02] transition-colors group">
            <td class="p-4">
              <a href={`/admin/customers/${c.id}`} class="block group-hover:text-[#36f4a4] transition-colors">
                <div class="text-xs font-bold text-white">{c.first_name} {c.last_name}</div>
                <div class="text-[10px] font-mono text-white/50 mt-0.5">{c.email}</div>
              </a>
            </td>
            <td class="p-4"><CustomerSegmentBadge segment={getSegment(c)} /></td>
            <td class="p-4 text-xs font-mono text-white/80 text-right">{c.order_count || 0}</td>
            <td class="p-4 text-xs font-mono text-[#36f4a4] font-bold text-right">${(c.total_spent || 0).toLocaleString()}</td>
            <td class="p-4 text-[10px] font-mono text-white/40">{new Date(c.created_at).toLocaleDateString()}</td>
          </tr>
        {:else}
          <tr><td colspan="5" class="p-8 text-center text-xs font-mono text-white/30 uppercase">No customers found.</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>