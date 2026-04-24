<script lang="ts">
  export let title: string = 'Command Center';
</script>

<header
  class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#111318] px-6"
>
  <h1 class="font-mono text-sm font-bold tracking-widest text-white uppercase">
    {title}
  </h1>

  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <span class="relative flex h-2 w-2">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#36f4a4] opacity-75"
        ></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-[#36f4a4]"
        ></span>
      </span>
      <span class="font-mono text-[9px] tracking-widest text-white/40 uppercase"
        >D1 Edge Active</span
      >
    </div>

    <div class="mx-2 h-4 w-px bg-white/10"></div>

    <button
      class="flex h-8 w-8 items-center justify-center border border-white/10 bg-white/5 font-mono text-xs font-bold text-white uppercase transition-colors hover:bg-white/10 focus:outline-none"
    >
      A
    </button>
  </div>
</header>
