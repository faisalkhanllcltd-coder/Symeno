<script lang="ts">
  let { type = 'info', message } = $props<{
    type?: 'info' | 'warning' | 'error' | 'success';
    message: string;
  }>();

  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',   
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    error: 'bg-brand-alert/10 border-brand-alert/30 text-brand-alert',  
    success: 'bg-brand/10 border-brand/30 text-brand',
  };
</script>

<div class="border p-4 font-mono text-xs tracking-wide transition-colors {styles[type]}">
  {message}
</div>
