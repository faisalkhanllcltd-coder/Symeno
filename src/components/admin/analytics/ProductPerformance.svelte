<script lang="ts">
  let { products = [] } = $props<{ products: any[] }>();
</script>

<div class="bg-[#111318] p-6 border border-white/10 h-full">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">Top Performers (SKUs)</h3>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <tbody class="divide-y divide-white/5">
        {#each products as product, i}
          <tr class="hover:bg-white/[0.02]">
            <td class="py-3 text-[10px] font-mono text-white/30 w-8">#{i + 1}</td>
            <td class="py-3 text-xs font-medium text-white">{product.title}</td>
            <td class="py-3 text-xs font-mono text-[#36f4a4] font-bold text-right">${Number(product.revenue).toLocaleString()}</td>
          </tr>
        {:else}
          <tr><td colspan="3" class="py-6 text-center text-[10px] font-mono text-white/30 uppercase">No product data.</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>