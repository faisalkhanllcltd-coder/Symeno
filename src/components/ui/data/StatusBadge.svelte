<script lang="ts">
  export let status: 'success' | 'warning' | 'error' | 'neutral' | 'info' = 'neutral';
  export let label: string;

  const variants = {
    success: 'bg-[#36f4a4]/10 text-[#36f4a4] border-[#36f4a4]/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-white/5 text-white/60 border-white/10'
  };
</script>

<span class="inline-flex items-center justify-center px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest font-mono {variants[status]}">
  {label}
</span>
