<script lang="ts">
  let { data = [] } = $props<{ data: { date: string; amount: number }[] }>();

  let maxAmount = $derived(Math.max(...data.map((d) => d.amount), 100));
  let points = $derived(
    data
      .map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const y = 100 - (d.amount / maxAmount) * 100;
        return `${x},${y}`;
      })
      .join(' ')
  );
</script>

<div class="flex h-full flex-col border border-white/10 bg-[#111318] p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-white/50 uppercase"
  >
    Revenue Velocity (30 Days)
  </h3>

  <div class="relative h-48 min-h-[200px] w-full flex-1">
    {#if data.length > 1}
      <svg
        class="h-full w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line
          x1="0"
          y1="25"
          x2="100"
          y2="25"
          stroke="rgba(255,255,255,0.05)"
          stroke-width="0.5"
        />
        <line
          x1="0"
          y1="50"
          x2="100"
          y2="50"
          stroke="rgba(255,255,255,0.05)"
          stroke-width="0.5"
        />
        <line
          x1="0"
          y1="75"
          x2="100"
          y2="75"
          stroke="rgba(255,255,255,0.05)"
          stroke-width="0.5"
        />

        <polyline
          fill="none"
          stroke="#36f4a4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          {points}
        />

        <polygon fill="url(#gradient)" points="0,100 {points} 100,100" />
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(54, 244, 164, 0.2)" />
            <stop offset="100%" stop-color="rgba(54, 244, 164, 0)" />
          </linearGradient>
        </defs>
      </svg>
    {:else}
      <div
        class="flex h-full w-full items-center justify-center font-mono text-xs text-white/30"
      >
        Awaiting data aggregation...
      </div>
    {/if}
  </div>
</div>
