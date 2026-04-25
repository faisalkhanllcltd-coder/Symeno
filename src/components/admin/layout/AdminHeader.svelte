<script lang="ts">
  let { title = 'Command Center' } = $props<{ title?: string }>();
</script>

<header
  class="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-outline bg-surface px-6"
>
  <h1 class="font-mono text-sm font-bold tracking-widest text-content uppercase">
    {title}
  </h1>

  <div class="flex items-center gap-4">
    <div class="flex items-center gap-2">
      <span class="relative flex h-2 w-2">
        <span
          class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75"
        ></span>
        <span class="relative inline-flex h-2 w-2 rounded-full bg-brand"
        ></span>
      </span>
      <span class="font-mono text-[9px] tracking-widest text-content-muted uppercase"
        >D1 Edge Active</span
      >
    </div>

    <div class="mx-2 h-4 w-px bg-outline"></div>

    <button
      class="flex h-8 w-8 items-center justify-center border border-outline bg-white/5 font-mono text-xs font-bold text-content uppercase transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      A
    </button>
  </div>
</header>
