<script lang="ts">
  let { item, onremove } = $props<{
    item: { id: string; name: string; price: number; qty: number };
    onremove?: (id: string) => void;
  }>();
</script>

<div class="flex gap-4 border border-outline bg-surface p-4">        
  <div
    class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden border border-outline bg-base"     
  >
    <img
      src="https://placehold.co/80x80/1a1a1a/36F4A4?text={item.name.charAt(0)}"
      alt={item.name}
      width="80"
      height="80"
      loading="lazy"
      decoding="async"
      class="h-full w-full object-cover object-center"
    />
  </div>
  <div class="flex flex-1 flex-col justify-between">
    <div class="flex items-start justify-between">
      <h3 class="text-sm leading-tight font-bold text-content">{item.name}</h3>
      <button
        class="p-2 -m-2 font-mono text-[10px] text-content-muted uppercase hover:text-brand-alert focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-alert rounded-sm"
        onclick={() => onremove?.(item.id)}>Remove</button
      >
    </div>
    <div class="flex items-end justify-between">
      <span class="font-mono text-xs text-content-muted">Qty: {item.qty}</span>
      <span class="font-mono text-sm font-bold text-content"
        >${(item.price * item.qty).toFixed(2)}</span
      >
    </div>
  </div>
</div>