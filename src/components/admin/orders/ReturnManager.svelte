
<script lang='ts'>
  let { returns = [] } = $props<{ returns: any[] }>();
</script>
<div class='space-y-4'>
  {#each returns as rma}
    <div class='bg-[#111318] border border-white/10 p-4 flex justify-between items-center'>
      <div>
        <h4 class='text-xs font-bold text-white uppercase'>RMA: {rma.id.substring(0,8)}</h4>
        <p class='text-[10px] font-mono text-white/50'>Order: {rma.order_id.substring(0,8)}</p>
      </div>
      <span class='text-[9px] px-2 py-0.5 border border-amber-500/30 text-amber-400 bg-amber-500/10 uppercase tracking-widest'>{rma.status}</span>
    </div>
  {:else}
    <div class='p-8 text-center text-white/30 text-[10px] font-mono uppercase border border-white/10'>No active RMA requests.</div>
  {/each}
</div>
