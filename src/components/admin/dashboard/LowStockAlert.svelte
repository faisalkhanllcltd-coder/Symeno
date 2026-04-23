<script lang="ts">
  let { items = [] } = $props<{ items: { sku: string, title: string, qty: number }[] }>();
</script>

<div class="bg-[#111318] border border-white/10 overflow-hidden">
  <div class="p-4 border-b border-white/10 bg-amber-500/5">
    <h3 class="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">Critical Inventory Levels</h3>
  </div>
  <ul class="divide-y divide-white/5">
    {#each items as item}
      <li class="p-4 flex justify-between items-center hover:bg-white/[0.02]">
        <div>
          <p class="text-xs text-white font-medium">{item.title}</p>
          <p class="text-[10px] text-white/40 font-mono mt-0.5">SKU: {item.sku}</p>
        </div>
        <span class="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1">{item.qty} left</span>
      </li>
    {:else}
      <li class="p-8 text-center text-[10px] font-mono text-white/30 uppercase">Inventory levels nominal.</li>
    {/each}
  </ul>
</div>