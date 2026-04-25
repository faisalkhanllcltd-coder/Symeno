<script lang="ts">
  let { brands = [] } = $props<{ brands?: any[] }>();
</script>

<div class="overflow-x-auto border border-outline bg-surface">
  <table class="w-full border-collapse text-left whitespace-nowrap">
    <thead>
      <tr
        class="border-b border-outline bg-surface font-mono text-[10px] tracking-widest text-content-muted uppercase"
      >
        <th class="p-4 font-normal">Brand</th>
        <th class="p-4 font-normal">Origin</th>
        <th class="p-4 text-center font-normal">Status</th>
        <th class="p-4 text-right font-normal">Actions</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-outline">
      {#each brands as brand}
        <tr class="transition-colors hover:bg-white/[0.02]">
          <td class="p-4">
            <div class="flex items-center gap-3">
              {#if brand.logo_url}
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  class="h-8 w-8 rounded border border-outline bg-white/5 object-contain p-1"
                />
              {:else}
                <div
                  class="flex h-8 w-8 items-center justify-center rounded border border-outline bg-base font-mono text-[10px] text-content-muted"
                >
                  {brand.name.substring(0, 2).toUpperCase()}
                </div>
              {/if}
              <div>
                <a
                  href={`/admin/brands/${brand.id}`}
                  class="text-xs font-bold text-content transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
                  >{brand.name}</a
                >
                <div class="mt-0.5 font-mono text-[9px] text-content-muted">
                  /brands/{brand.slug}
                </div>
              </div>
            </div>
          </td>
          <td class="p-4 font-mono text-xs text-content-muted"
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
                class="border border-outline bg-white/5 px-2 py-1 text-[9px] tracking-widest text-content-muted uppercase"
                >Standard</span
              >
            {/if}
          </td>
          <td class="p-4 text-right">
            <a
              href={`/admin/brands/${brand.id}`}
              class="border border-outline px-3 py-1.5 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:border-outline hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
              >Edit</a
            >
          </td>
        </tr>
      {:else}
        <tr
          ><td
            colspan="4"
            class="p-8 text-center text-xs font-mono text-content-muted uppercase"
            >No brands registered.</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
</div>
