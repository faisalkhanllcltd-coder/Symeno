<script lang="ts">
  let { segment } = $props<{ segment: string }>();

  let badgeClass = $derived(() => {
    switch (segment) {
      case 'VIP':
        return 'bg-[#36f4a4]/10 text-[#36f4a4] border-[#36f4a4]/30';
      case 'At-Risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Wholesale':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'High-Return':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      default:
        return 'bg-white/5 text-white/50 border-white/10';
    }
  });
</script>

<span
  class="inline-block border px-2 py-1 text-[9px] font-bold tracking-widest uppercase {badgeClass()}"
>
  {segment}
</span>
