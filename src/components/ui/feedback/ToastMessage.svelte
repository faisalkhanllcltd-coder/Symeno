<script lang="ts">
  export let message: string;
  export let type: 'success' | 'error' | 'info' = 'info';
  
  const types = {
    success: 'bg-[#111318] border-l-[#36f4a4] text-white',
    error: 'bg-[#111318] border-l-rose-500 text-rose-400',
    info: 'bg-[#111318] border-l-[#dae5e6]/30 text-[#dae5e6]'
  };
</script>

<div class="fixed bottom-6 right-6 p-4 border-l-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] font-mono text-xs uppercase tracking-widest {types[type]} z-[100] min-w-[250px] animate-[slide-up_0.3s_ease-out]">
  {message}
</div>

<style>
  @keyframes slide-up {
    from { transform: translateY(100%); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
</style>
