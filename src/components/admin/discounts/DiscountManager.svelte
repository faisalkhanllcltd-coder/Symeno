<script lang="ts">
  let { discounts = [] } = $props<{ discounts: any[] }>();
  let searchQuery = $state('');

  let filtered = $derived(discounts.filter(d => d.code?.toLowerCase().includes(searchQuery.toLowerCase())));

  const isActive = (d: any) => {
    if (!d.is_active) return false;
    if (d.end_date && new Date(d.end_date) < new Date()) return false;
    if (d.usage_limit && d.current_usage >= d.usage_limit) return false;
    return true;
  };
</script>

<div class="space-y-4">
  <div class="bg-[#111318] p-4 border border-white/10 flex justify-between items-center">
    <input type="text" bind:value={searchQuery} placeholder="Search promo codes..." class="w-72 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    <a href="/admin/discounts/new" class="bg-[#36f4a4] text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors block">Create Campaign</a>
  </div>

  <div class="bg-[#111318] border border-white/10 overflow-x-auto">
    <table class="w-full text-left border-collapse whitespace-nowrap">
      <thead>
        <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
          <th class="p-4 font-normal">Promo Code</th>
          <th class="p-4 font-normal">Rules</th>
          <th class="p-4 font-normal text-right">Usage</th>
          <th class="p-4 font-normal text-right">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/[0.04]">
        {#each filtered as d}
          <tr class="hover:bg-white/[0.02] transition-colors">
            <td class="p-4">
              <span class="text-xs font-mono font-bold {isActive(d) ? 'text-[#36f4a4]' : 'text-white/40'}">{d.code}</span>
              {#if d.stackable}
                <span class="block text-[9px] text-amber-400 mt-1 uppercase tracking-widest">Stackable</span>
              {/if}
            </td>
            <td class="p-4 text-[10px] font-mono text-white/70 space-y-1">
              <div>Type: {d.type.replace('_', ' ')}</div>
              <div>Value: {d.type === 'PERCENTAGE' ? `${d.value}%` : `$${d.value}`}</div>
              {#if d.minimum_order > 0}<div>Min Spend: ${d.minimum_order}</div>{/if}
            </td>
            <td class="p-4 text-right">
              <div class="text-xs font-mono text-white">{d.current_usage}</div>
              {#if d.usage_limit}
                <div class="text-[9px] text-white/40 font-mono">Limit: {d.usage_limit}</div>
                <div class="w-full bg-white/5 h-1 mt-1 rounded-full overflow-hidden max-w-[100px] ml-auto">
                  <div class="bg-[#36f4a4] h-full" style="width: {(d.current_usage / d.usage_limit) * 100}%"></div>
                </div>
              {/if}
            </td>
            <td class="p-4 text-right">
              {#if isActive(d)}
                <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-[#36f4a4]/30 text-[#36f4a4] bg-[#36f4a4]/10">Active</span>
              {:else}
                <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-rose-500/30 text-rose-400 bg-rose-500/10">Expired</span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>