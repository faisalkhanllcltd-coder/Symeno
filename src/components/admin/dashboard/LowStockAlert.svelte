<script lang="ts">
  let { items = [] } = $props<{
    items?: { slug: string; title: string; qty: number }[];
  }>();
</script>

<div class="overflow-hidden border border-outline bg-surface">
  <div class="border-b border-outline bg-amber-500/5 p-4">
    <h3
      class="font-mono text-[10px] font-bold tracking-widest text-amber-400 uppercase"
    >
      Critical Inventory Levels
    </h3>
  </div>
  <ul class="divide-y divide-outline">
    {#each items as item}
      <li class="flex items-center justify-between p-4 hover:bg-white/[0.02]">
        <div>
          <p class="text-xs font-medium text-content">{item.title}</p>
          <p class="mt-0.5 font-mono text-[10px] text-content-muted">
            Slug: {item.slug}
          </p>
        </div>
        <span
          class="bg-amber-500/10 px-2 py-1 font-mono text-xs font-bold text-amber-400"
          >{item.qty} left</span
        >
      </li>
    {:else}
      <li class="p-8 text-center text-[10px] font-mono text-content-muted uppercase">
        Inventory levels nominal.
      </li>
    {/each}
  </ul>
</div>
