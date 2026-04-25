<script lang="ts">
  let { products }: { products: any[] } = $props();
</script>

<div class="h-full border border-outline bg-surface p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Top Performers (SKUs)
  </h3>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <tbody class="divide-y divide-outline">
        {#each products as product, i}
          <tr class="hover:bg-white/[0.02]">
            <td class="w-8 py-3 font-mono text-[10px] text-content-muted"
              >#{i + 1}</td
            >
            <td class="py-3 text-xs font-medium text-content">{product.title}</td>
            <td
              class="py-3 text-right font-mono text-xs font-bold text-brand"
            >${Number(product.revenue).toLocaleString()}</td
            >
          </tr>
        {:else}
          <tr
            ><td
              colspan="3"
              class="py-6 text-center text-[10px] font-mono text-content-muted uppercase"
              >No product data.</td
            ></tr
          >
        {/each}
      </tbody>
    </table>
  </div>
</div>
