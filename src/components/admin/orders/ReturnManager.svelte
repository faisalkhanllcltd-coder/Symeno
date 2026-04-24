<script lang="ts">
  let { returns = [] } = $props<{ returns: any[] }>();
</script>

<div class="space-y-4">
  {#each returns as rma}
    <div
      class="flex items-center justify-between border border-white/10 bg-[#111318] p-4"
    >
      <div>
        <h4 class="text-xs font-bold text-white uppercase">
          RMA: {rma.id.substring(0, 8)}
        </h4>
        <p class="font-mono text-[10px] text-white/50">
          Order: {rma.order_id.substring(0, 8)}
        </p>
      </div>
      <span
        class="border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[9px] tracking-widest text-amber-400 uppercase"
        >{rma.status}</span
      >
    </div>
  {:else}
    <div
      class="p-8 text-center text-white/30 text-[10px] font-mono uppercase border border-white/10"
    >
      No active RMA requests.
    </div>
  {/each}
</div>
