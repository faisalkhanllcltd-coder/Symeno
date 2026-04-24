<script lang="ts">
  let { stats = { totalOrders: 0, totalSpent: 0, points: 0 } } = $props<{
    stats?: { totalOrders: number; totalSpent: number; points: number };
  }>();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-3">     
  <div
    class="flex flex-col justify-between border border-outline bg-surface p-5"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Total Orders
    </h3>
    <p class="font-mono text-2xl text-content">{stats.totalOrders}</p>
  </div>
  <div
    class="flex flex-col justify-between border border-outline bg-surface p-5"
  >
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
    >
      Lifetime Spend
    </h3>
    <p class="font-mono text-2xl text-brand">       
      ${stats.totalSpent.toLocaleString(undefined, {    
        minimumFractionDigits: 2,
      })}
    </p>
  </div>
  <div
    class="relative flex flex-col justify-between overflow-hidden border border-brand/20 bg-surface p-5"
  >
    <div
      class="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-brand/10 blur-xl"
    ></div>
    <h3
      class="mb-2 font-mono text-[10px] font-bold tracking-widest text-brand uppercase relative z-10"
    >
      Loyalty Points
    </h3>
    <p class="font-mono text-2xl text-content relative z-10">
      {stats.points}
      <span class="font-sans text-[10px] tracking-normal text-content-muted"
        >pts</span
      >
    </p>
  </div>
</div>
