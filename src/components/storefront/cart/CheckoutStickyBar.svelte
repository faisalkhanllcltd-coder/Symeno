<script lang="ts">
  export let price: number = 0;
  export let title: string = '';
  
  import Button from '../../ui/navigation/Button.svelte';
</script>

<div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 md:hidden flex justify-between items-center">
  <div>
    <p class="text-[10px] font-mono text-gray-500 uppercase tracking-widest truncate max-w-[150px]">{title}</p>
    <p class="text-sm font-bold text-gray-900 font-mono">${price.toFixed(2)}</p>
  </div>
  <Button variant="primary">Add to Cart</Button>
</div>
