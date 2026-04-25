<script lang="ts">
  import Button from '../../ui/navigation/Button.svelte';

  let { price = 0, title = '', onaddtocart } = $props<{
    price?: number;
    title?: string;
    onaddtocart?: () => void;
  }>();
</script>

<div
  class="fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-outline bg-base p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:hidden"
>
  <div>
    <p
      class="max-w-[150px] truncate font-mono text-[10px] tracking-widest text-content-muted uppercase"
    >
      {title}
    </p>
    <p class="font-mono text-sm font-bold text-content">${price.toFixed(2)}</p>
  </div>
  <Button variant="primary" onclick={onaddtocart}>Add to Cart</Button>
</div>
