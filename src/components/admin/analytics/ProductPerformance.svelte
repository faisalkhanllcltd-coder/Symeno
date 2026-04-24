<script lang="ts">
  let { products = [] } = $props<{ products: any[] }>();
</script>

<div class="h-full border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
  >
    Top Performers (SKUs)
  </h3>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <tbody class="divide-y divide-white/5">
        {#each products as product, i}
          <tr class="hover:bg-white/[0.02]">
            <td class="w-8 py-3 font-mono text-[10px] text-white/30"
              >#{i + 1}</td
            >
            <td class="py-3 text-xs font-medium text-white">{product.title}</td>
            <td
              class="py-3 text-right font-mono text-xs font-bold text-[#36f4a4]"
              >${Number(product.revenue).toLocaleString()}</td
            >
          </tr>
        {:else}
          <tr
            ><td
              colspan="3"
              class="py-6 text-center text-[10px] font-mono text-white/30 uppercase"
              >No product data.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
