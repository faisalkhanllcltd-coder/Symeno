<script lang="ts">
  let { discounts = [] }: { discounts?: any[] } = $props();
  let searchQuery = $state('');

  let filtered = $derived(
    discounts.filter((d) =>
      d.code?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const isActive = (d: any) => {
    if (!d.is_active) return false;
    if (d.end_date && new Date(d.end_date) < new Date()) return false;
    if (d.usage_limit && d.current_usage >= d.usage_limit) return false;
    return true;
  };
</script>

<div class="space-y-4">
  <div
    class="flex items-center justify-between border border-outline bg-surface p-4"
  >
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search promo codes..."
      class="w-72 border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    />
    <a
      href="/admin/discounts/new"
      class="block bg-brand px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >Create Campaign</a
    >
  </div>

  <div class="overflow-x-auto border border-outline bg-surface">
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr
          class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >
          <th class="p-4 font-normal">Promo Code</th>
          <th class="p-4 font-normal">Rules</th>
          <th class="p-4 text-right font-normal">Usage</th>
          <th class="p-4 text-right font-normal">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-outline">
        {#each filtered as d}
          <tr class="transition-colors hover:bg-white/[0.02]">
            <td class="p-4">
              <span
                class="font-mono text-xs font-bold {isActive(d)
                  ? 'text-brand'
                  : 'text-content-muted'}">{d.code}</span
              >
              {#if d.stackable}
                <span
                  class="mt-1 block text-[9px] tracking-widest text-amber-400 uppercase"
                  >Stackable</span
                >
              {/if}
            </td>
            <td class="space-y-1 p-4 font-mono text-[10px] text-content-muted">
              <div>Type: {d.type.replace('_', ' ')}</div>
              <div>
                Value: {d.type === 'PERCENTAGE' ? `${d.value}%` : `$${d.value}`}
              </div>
              {#if d.minimum_order > 0}<div>
                  Min Spend: ${d.minimum_order}
                </div>{/if}
            </td>
            <td class="p-4 text-right">
              <div class="font-mono text-xs text-content">{d.current_usage}</div>
              {#if d.usage_limit}
                <div class="font-mono text-[9px] text-content-muted">
                  Limit: {d.usage_limit}
                </div>
                <div
                  class="mt-1 ml-auto h-1 w-full max-w-[100px] overflow-hidden rounded-full bg-white/5"
                >
                  <div
                    class="h-full bg-brand"
                    style="width: {(d.current_usage / d.usage_limit) * 100}%"
                  ></div>
                </div>
              {/if}
            </td>
            <td class="p-4 text-right">
              {#if isActive(d)}
                <span
                  class="border border-brand/30 bg-brand/10 px-2 py-1 text-[9px] tracking-widest text-brand uppercase"
                  >Active</span
                >
              {:else}
                <span
                  class="border border-brand-alert/30 bg-brand-alert/10 px-2 py-1 text-[9px] tracking-widest text-brand-alert uppercase"
                  >Expired</span
                >
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
