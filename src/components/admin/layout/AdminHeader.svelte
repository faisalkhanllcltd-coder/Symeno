<script lang="ts">
  export let title: string = "Command Center";
</script>

<header class="h-16 bg-[#111318] border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
  <h1 class="text-sm font-bold text-white uppercase tracking-widest font-mono">{title}</h1>
  
  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <span class="relative flex h-2 w-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#36f4a4] opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2 w-2 bg-[#36f4a4]"></span>
      </span>
      <span class="text-[9px] font-mono uppercase tracking-widest text-white/40">D1 Edge Active</span>
    </div>
    
    <div class="w-px h-4 bg-white/10 mx-2"></div>
    
    <button class="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase font-mono hover:bg-white/10 transition-colors focus:outline-none">
      A
    </button>
  </div>
</header>
