<script lang="ts">
  let { data }: { data: any[] } = $props();

  let maxAmount = $derived(Math.max(...data.map((d) => Number(d.amount)), 100));
  let points = $derived(
    data
      .map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * 100;
        const y = 100 - (Number(d.amount) / maxAmount) * 100;
        return `${x},${y}`;
      })
      .join(' ')
  );

  let totalRevenue = $derived(
    data.reduce((sum, d) => sum + Number(d.amount), 0)
  );
</script>

<div class="flex h-full flex-col border border-outline bg-surface p-6">
  <div class="mb-6 flex items-start justify-between">
    <div>
      <h3
        class="mb-2 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
      >
        Gross Revenue (Period)
      </h3>
      <p class="font-mono text-3xl font-bold text-brand">
        ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  </div>

  <div class="relative min-h-[250px] w-full flex-1">
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
          stroke="currentColor"
          class="text-brand"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          {points}
        />
        <polygon fill="url(#revGradient)" points="0,100 {points} 100,100" />
        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.2" class="text-brand" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0" class="text-brand" />
          </linearGradient>
        </defs>
      </svg>
    {:else}
      <div
        class="flex h-full w-full items-center justify-center font-mono text-xs text-content-muted"
      >
        Insufficient data for chart
      </div>
    {/if}
  </div>
</div>
