<script lang="ts">
  let { brands = [] } = $props<{ brands: any[] }>();
</script>

<div class="bg-[#111318] border border-white/10 overflow-x-auto">
  <table class="w-full text-left border-collapse whitespace-nowrap">
    <thead>
      <tr class="bg-[#0a0b0e] border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
        <th class="p-4 font-normal">Brand</th>
        <th class="p-4 font-normal">Origin</th>
        <th class="p-4 font-normal text-center">Status</th>
        <th class="p-4 font-normal text-right">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/[0.04]">
      {#each brands as brand}
        <tr class="hover:bg-white/[0.02] transition-colors">
          <td class="p-4">
            <div class="flex items-center gap-3">
              {#if brand.logo_url}
                <img src={brand.logo_url} alt={brand.name} class="w-8 h-8 object-contain bg-white/5 p-1 rounded border border-white/10" />
              {:else}
                <div class="w-8 h-8 bg-[#1A1D23] border border-white/10 rounded flex items-center justify-center text-[10px] font-mono text-white/30">{brand.name.substring(0, 2).toUpperCase()}</div>
              {/if}
              <div>
                <a href={`/admin/brands/${brand.id}`} class="text-xs font-bold text-white hover:text-[#36f4a4] transition-colors">{brand.name}</a>
                <div class="text-[9px] font-mono text-white/40 mt-0.5">/brands/{brand.slug}</div>
              </div>
            </div>
          </td>
          <td class="p-4 text-xs font-mono text-white/60">{brand.country || '-'}</td>
          <td class="p-4 text-center">
            {#if brand.is_featured}
              <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-amber-500/30 text-amber-400 bg-amber-500/10">Featured</span>
            {:else}
              <span class="text-[9px] px-2 py-1 uppercase tracking-widest border border-white/10 text-white/40 bg-white/5">Standard</span>
            {/if}
          </td>
          <td class="p-4 text-right">
            <a href={`/admin/brands/${brand.id}`} class="text-[10px] font-mono uppercase tracking-widest border border-white/10 hover:border-white/30 px-3 py-1.5 text-white/70 hover:text-white transition-colors">Edit</a>
          </td>
        </tr>
      {:else}
        <tr><td colspan="4" class="p-8 text-center text-xs font-mono text-white/30 uppercase">No brands registered.</td></tr>
      {/each}
    </tbody>
  </table>
</div>