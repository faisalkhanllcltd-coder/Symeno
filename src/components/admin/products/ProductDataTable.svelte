<script lang="ts">
  let { products = [] } = $props<{ products: any[] }>();
</script>

<div class="overflow-x-auto border border-outline bg-surface">
  <table class="w-full border-collapse text-left">      
    <thead>
      <tr class="border-b border-outline bg-base">
        <th
          class="p-4 text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >SKU</th
        >
        <th
          class="p-4 text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Title</th
        >
        <th
          class="p-4 text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Price</th
        >
        <th
          class="p-4 text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Actions</th
        >
      </tr>
    </thead>
    <tbody class="divide-y divide-outline">        
      {#each products as p}
        <tr class="hover:bg-base/50 transition-colors">
          <td class="p-4 font-mono text-xs text-content-muted"
            >{p.id.substring(0, 8)}</td
          >
          <td class="p-4 text-xs font-bold text-content">{p.title}</td>
          <td class="p-4 font-mono text-xs text-brand"
            >${p.base_price.toFixed(2)}</td
          >
          <td class="p-4"
            ><a
              href="/admin/products/edit/{p.id}"        
              class="font-mono text-[10px] text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:text-brand"
              >Edit</a
            ></td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</div>