<script lang="ts">
  export let title: string = '';
  export let subtitle: string = '';
  export let className: string = '';
</script>

<div class="bg-[#111318] border border-white/10 flex flex-col {className}">
  {#if title || subtitle || $$slots.header}
    <div class="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
      <div>
        {#if title}<h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono">{title}</h3>{/if}
        {#if subtitle}<p class="text-[10px] font-mono text-white/40 mt-1">{subtitle}</p>{/if}
      </div>
      <slot name="header" />
    </div>
  {/if}
  
  <div class="p-4 flex-1">
    <slot />
  </div>

  {#if $$slots.footer}
    <div class="p-4 border-t border-white/10 bg-black/20">
      <slot name="footer" />
    </div>
  {/if}
</div>
