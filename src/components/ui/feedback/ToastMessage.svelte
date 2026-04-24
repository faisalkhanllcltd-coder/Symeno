<script lang="ts">
  let {
    message,
    type = 'info'
  }: {
    message: string;
    type?: 'success' | 'error' | 'info';
  } = $props();

  const types = {
    success: 'bg-surface border-l-brand text-content',
    error: 'bg-surface border-l-brand-alert text-brand-alert',
    info: 'bg-surface border-l-content-muted text-content',
  };
</script>

<div class="fixed right-6 bottom-6 border-l-4 p-4 font-mono text-xs tracking-widest uppercase shadow-2xl {types[type]} z-[100] min-w-[250px] animate-[slide-up_0.3s_ease-out]">
  {message}
</div>

<style>
  @keyframes slide-up {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
</style>