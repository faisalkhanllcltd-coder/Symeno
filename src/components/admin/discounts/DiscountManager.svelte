<script lang="ts">
  let { discounts = [] } = $props<{ discounts: any[] }>();
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
    class="flex items-center justify-between border border-white/10 bg-[#111318] p-4"
  >
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search promo codes..."
      class="w-72 border border-white/10 bg-[#1A1D23] px-3 py-2 font-mono text-sm text-white focus:border-[#36f4a4]/50 focus:outline-none"
    />
    <a
      href="/admin/discounts/new"
      class="block bg-[#36f4a4] px-4 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white"
      >Create Campaign</a
    >
  </div>

  <div class="overflow-x-auto border border-white/10 bg-[#111318]">
    <table class="w-full border-collapse text-left whitespace-nowrap">
      <thead>
        <tr
          class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
        >
          <th class="p-4 font-normal">Promo Code</th>
          <th class="p-4 font-normal">Rules</th>
          <th class="p-4 text-right font-normal">Usage</th>
          <th class="p-4 text-right font-normal">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each filtered as d}
          <tr class="transition-colors hover:bg-white/[0.02]">
            <td class="p-4">
              <span
                class="font-mono text-xs font-bold {isActive(d)
                  ? 'text-[#36f4a4]'
                  : 'text-white/40'}">{d.code}</span
              >
              {#if d.stackable}
                <span
                  class="mt-1 block text-[9px] tracking-widest text-amber-400 uppercase"
                  >Stackable</span
                >
              {/if}
            </td>
            <td class="space-y-1 p-4 font-mono text-[10px] text-white/70">
              <div>Type: {d.type.replace('_', ' ')}</div>
              <div>
                Value: {d.type === 'PERCENTAGE' ? `${d.value}%` : `$${d.value}`}
              </div>
              {#if d.minimum_order > 0}<div>
                  Min Spend: ${d.minimum_order}
                </div>{/if}
            </td>
            <td class="p-4 text-right">
              <div class="font-mono text-xs text-white">{d.current_usage}</div>
              {#if d.usage_limit}
                <div class="font-mono text-[9px] text-white/40">
                  Limit: {d.usage_limit}
                </div>
                <div
                  class="mt-1 ml-auto h-1 w-full max-w-[100px] overflow-hidden rounded-full bg-white/5"
                >
                  <div
                    class="h-full bg-[#36f4a4]"
                    style="width: {(d.current_usage / d.usage_limit) * 100}%"
                  ></div>
                </div>
              {/if}
            </td>
            <td class="p-4 text-right">
              {#if isActive(d)}
                <span
                  class="border border-[#36f4a4]/30 bg-[#36f4a4]/10 px-2 py-1 text-[9px] tracking-widest text-[#36f4a4] uppercase"
                  >Active</span
                >
              {:else}
                <span
                  class="border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[9px] tracking-widest text-rose-400 uppercase"
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
