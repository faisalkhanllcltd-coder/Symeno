<script lang="ts">
  let { brands = [] } = $props<{ brands: any[] }>();
</script>

<div class="overflow-x-auto border border-white/10 bg-[#111318]">
  <table class="w-full border-collapse text-left whitespace-nowrap">
    <thead>
      <tr
        class="border-b border-white/10 bg-[#0a0b0e] font-mono text-[10px] tracking-widest text-white/40 uppercase"
      >
        <th class="p-4 font-normal">Brand</th>
        <th class="p-4 font-normal">Origin</th>
        <th class="p-4 text-center font-normal">Status</th>
        <th class="p-4 text-right font-normal">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-white/[0.04]">
      {#each brands as brand}
        <tr class="transition-colors hover:bg-white/[0.02]">
          <td class="p-4">
            <div class="flex items-center gap-3">
              {#if brand.logo_url}
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  class="h-8 w-8 rounded border border-white/10 bg-white/5 object-contain p-1"
                />
              {:else}
                <div
                  class="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-[#1A1D23] font-mono text-[10px] text-white/30"
                >
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
              {/if}
              <div>
                <a
                  href={`/admin/brands/${brand.id}`}
                  class="text-xs font-bold text-white transition-colors hover:text-[#36f4a4]"
                  >{brand.name}</a
                >
                <div class="mt-0.5 font-mono text-[9px] text-white/40">
                  /brands/{brand.slug}
                </div>
              </div>
            </div>
          </td>
          <td class="p-4 font-mono text-xs text-white/60"
            >{brand.country || '-'}</td
          >
          <td class="p-4 text-center">
            {#if brand.is_featured}
              <span
                class="border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[9px] tracking-widest text-amber-400 uppercase"
                >Featured</span
              >
            {:else}
              <span
                class="border border-white/10 bg-white/5 px-2 py-1 text-[9px] tracking-widest text-white/40 uppercase"
                >Standard</span
              >
            {/if}
          </td>
          <td class="p-4 text-right">
            <a
              href={`/admin/brands/${brand.id}`}
              class="border border-white/10 px-3 py-1.5 font-mono text-[10px] tracking-widest text-white/70 uppercase transition-colors hover:border-white/30 hover:text-white"
              >Edit</a
            >
          </td>
        </tr>
      {:else}
        <tr
          ><td
            colspan="4"
            class="p-8 text-center text-xs font-mono text-white/30 uppercase"
            >No brands registered.</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>
