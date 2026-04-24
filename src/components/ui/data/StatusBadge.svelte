<script lang="ts">
  let { status = 'neutral', label } = $props<{
    status?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
    label: string;
  }>();

  const variants = {
    success: 'bg-brand/10 text-brand border-brand/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-brand-alert/10 text-brand-alert border-brand-alert/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-base text-content-muted border-outline',
  };
</script>

<span
  class="inline-flex items-center justify-center border px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase transition-colors {variants[
    status
  ]}"
>
  {label}
</span>
