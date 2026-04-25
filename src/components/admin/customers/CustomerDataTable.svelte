<script lang="ts">
  import CustomerSegmentBadge from './CustomerSegmentBadge.svelte';

  let { customers = [] } = $props<{ customers?: any[] }>();
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
    class="flex items-center justify-between border border-outline bg-surface p-4"
  >
    <div class="relative w-72">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search email or name..."
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content placeholder:text-content-muted focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>
    <button
      class="border border-outline px-4 py-2 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >Export CSV</button
    >
  </div>

  <div class="overflow-x-auto border border-outline bg-surface">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr
          class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >
          <th class="p-4 font-normal">Customer</th>
          <th class="p-4 font-normal">Segment</th>
          <th class="p-4 text-right font-normal">Orders</th>
          <th class="p-4 text-right font-normal">Lifetime Value</th>
          <th class="p-4 font-normal">Joined</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline">
        {#each filteredCustomers as c}
          <tr class="group transition-colors hover:bg-white/[0.02]">
            <td class="p-4">
              <a
                href={`/admin/customers/${c.id}`}
                class="block transition-colors group-hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >
                <div class="text-xs font-bold text-content">
                  {c.first_name}
                  {c.last_name}
                </div>
                <div class="mt-0.5 font-mono text-[10px] text-content-muted">
                  {c.email}
                </div>
              </a>
            </td>
            <td class="p-4"><CustomerSegmentBadge segment={getSegment(c)} /></td
            >
            <td class="p-4 text-right font-mono text-xs text-content-muted"
              >{c.order_count || 0}</td
            >
            <td
              class="p-4 text-right font-mono text-xs font-bold text-brand"
              >${(c.total_spent || 0).toLocaleString()}</td
            >
            <td class="p-4 font-mono text-[10px] text-content-muted"
              >{new Date(c.created_at).toLocaleDateString()}</td
            >
          </tr>
        {:else}
          <tr
            ><td
              colspan="5"
              class="p-8 text-center text-xs font-mono text-content-muted uppercase"
              >No customers found.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
