<script lang="ts">
  // Mocked for Edge environment. Real integration requires GA4/Pixel APIs.
  let funnel = [
    { stage: 'Site Sessions', users: 12450, color: 'bg-blue-400' },
    { stage: 'Product Views', users: 8200, color: 'bg-purple-400' },
    { stage: 'Add to Cart', users: 1420, color: 'bg-amber-400' },
    { stage: 'Purchases', users: 312, color: 'bg-[#36f4a4]' }
  ];
  let maxUsers = funnel[0].users;
</script>

<div class="bg-[#111318] p-6 border border-white/10 h-full">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">Storefront Conversion Funnel</h3>
  <div class="flex flex-col items-center space-y-2 w-full">
    {#each funnel as step, i}
      {@const width = (step.users / maxUsers) * 100}
      {@const conversion = i > 0 ? ((step.users / funnel[i-1].users) * 100).toFixed(1) : '100'}
      <div class="w-full flex items-center gap-4">
        <div class="w-24 text-right text-[10px] font-mono text-white/60 uppercase">{step.stage}</div>
        <div class="flex-1 flex justify-center">
          <div class="h-10 flex items-center justify-center text-xs font-mono font-bold text-black transition-all" style="width: {width}%;" class="{step.color}">
            {step.users.toLocaleString()}
          </div>
        </div>
        <div class="w-16 text-left text-[9px] font-mono text-white/30">{i > 0 ? `${conversion}%` : '-'}</div>
      </div>
    {/each}
  </div>
</div>