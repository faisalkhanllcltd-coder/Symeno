<script lang="ts">
  export let price: number = 0;
  export let title: string = '';

  import Button from '../../ui/navigation/Button.svelte';
</script>

<div
  class="fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-gray-200 bg-white p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:hidden"
>
  <div>
    <p
      class="max-w-[150px] truncate font-mono text-[10px] tracking-widest text-gray-500 uppercase"
    >
      {title}
    </p>
    <p class="font-mono text-sm font-bold text-gray-900">${price.toFixed(2)}</p>
  </div>
  <Button variant="primary">Add to Cart</Button>
</div>
