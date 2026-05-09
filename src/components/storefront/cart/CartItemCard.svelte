<script lang="ts">
  let { item, onremove, onupdate } = $props<{
    item: { id: string; slug: string; name: string; price: number; qty: number; image?: string };
    onremove?: (id: string) => void;
    onupdate?: (id: string, qty: number) => void;
  }>();
</script>

<div class="flex gap-4 border border-outline bg-surface p-4 rounded-xl">        
  <div class="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-outline bg-base">
    {#if item.image}
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover object-center"
      />
    {:else}
      <span class="text-content-muted font-mono text-[10px] tracking-widest uppercase opacity-50">IMG</span>
    {/if}
  </div>
  
  <div class="flex flex-1 flex-col justify-between">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-sm leading-tight font-bold text-content max-w-[200px] truncate">{item.name}</h3>
        <p class="font-mono text-[10px] text-content-muted mt-1">ID: {item.slug}</p>
      </div>
      <button
        class="p-2 -m-2 font-mono text-[10px] text-content-muted uppercase hover:text-brand-alert focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm"
        onclick={() => onremove?.(item.id)}>Remove</button>
    </div>
    
    <div class="flex items-end justify-between mt-4">
      <div class="bg-base border-outline flex items-center rounded-md border p-0.5">
        <button
          onclick={() => onupdate?.(item.id, item.qty - 1)}
          class="text-content-muted hover:text-content flex min-h-[32px] min-w-[32px] items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm"
          aria-label="Decrease">&minus;</button>
        <span class="text-content w-8 text-center font-mono text-xs">{item.qty}</span>
        <button
          onclick={() => onupdate?.(item.id, item.qty + 1)}
          class="text-content-muted hover:text-content flex min-h-[32px] min-w-[32px] items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm"
          aria-label="Increase">&plus;</button>
      </div>
      <span class="font-mono text-sm font-bold text-content">${(item.price * item.qty).toFixed(2)}</span>
    </div>
  </div>
</div>