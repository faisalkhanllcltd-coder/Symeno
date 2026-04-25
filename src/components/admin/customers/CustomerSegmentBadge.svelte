<script lang="ts">
  let { segment } = $props<{ segment: string }>();

  let badgeClass = $derived(() => {
    switch (segment) {
      case 'VIP':
        return 'bg-brand/10 text-brand border-brand/30';
      case 'At-Risk':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Wholesale':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'High-Return':
        return 'bg-brand-alert/10 text-brand-alert border-brand-alert/30';
      default:
        return 'bg-base text-content-muted border-outline';
    }
  });
</script>

<span
  class="inline-block border px-2 py-1 text-[9px] font-bold tracking-widest uppercase {badgeClass()}"
>
  {segment}
</span>
