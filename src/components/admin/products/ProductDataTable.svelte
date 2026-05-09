<script lang="ts">
  let { products = [] } = $props<{ products: any[] }>();
</script>

<div class="overflow-x-auto border border-outline bg-surface rounded-lg shadow-sm">
  <table class="w-full border-collapse text-left">      
    <thead>
      <tr class="border-b border-outline bg-base/50">
        <th class="p-3 text-[9px] font-bold tracking-widest text-content-muted uppercase">Asset ID</th>
        <th class="p-3 text-[9px] font-bold tracking-widest text-content-muted uppercase">Designation</th>
        <th class="p-3 text-[9px] font-bold tracking-widest text-content-muted uppercase">Category</th>
        <th class="p-3 text-[9px] font-bold tracking-widest text-content-muted uppercase">Status</th>
        <th class="p-3 text-[9px] font-bold tracking-widest text-content-muted uppercase text-right">Value</th>
        <th class="p-3 text-[9px] font-bold tracking-widest text-content-muted uppercase text-right">Terminal</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-outline/50">        
      {#each products as p}
        <tr class="hover:bg-base/80 transition-colors group">
          <td class="p-3 font-mono text-[9px] text-content-muted">{p.id.substring(0, 8)}</td>
          <td class="p-3 text-[11px] font-bold text-content max-w-[200px] truncate">{p.name}</td>
          <td class="p-3 font-mono text-[9px] text-content-muted uppercase truncate max-w-[120px]">{p.category || 'N/A'}</td>
          <td class="p-3">
            {#if p.in_stock === 1}
              <span class="inline-flex items-center gap-1.5 rounded-sm border border-brand/20 bg-brand/5 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-brand uppercase">
                <span class="h-1 w-1 rounded-full bg-brand"></span> Live
              </span>
            {:else}
              <span class="inline-flex items-center gap-1.5 rounded-sm border border-brand-alert/20 bg-brand-alert/5 px-1.5 py-0.5 font-mono text-[8px] tracking-widest text-brand-alert uppercase">
                <span class="h-1 w-1 rounded-full bg-brand-alert"></span> Depleted
              </span>
            {/if}
          </td>
          <td class="p-3 font-mono text-[10px] text-content font-bold text-right">${p.price?.toFixed(2)}</td>
          <td class="p-3 text-right">
            <a
              href={`/admin/products/edit/${p.id}`}        
              class="border border-outline bg-base px-2.5 py-1.5 font-mono text-[9px] text-content-muted uppercase transition-colors hover:border-brand hover:text-brand focus-visible:outline-none rounded-sm opacity-0 group-hover:opacity-100"
            >Manage</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>