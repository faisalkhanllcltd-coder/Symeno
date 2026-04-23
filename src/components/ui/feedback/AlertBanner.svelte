<script lang="ts">
  export let type: 'info' | 'warning' | 'error' | 'success' = 'info';
  export let message: string;

  const styles = {
    info: 'bg-gray-50 border-gray-200 text-gray-600',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    success: 'bg-[#10b981]/10 border-[#10b981]/30 text-[#059669]'
  };
</script>

<div class="p-4 border text-xs font-mono tracking-wide {styles[type]}">
  {message}
</div>
