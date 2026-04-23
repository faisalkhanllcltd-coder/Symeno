<script lang="ts">
  export let item: { id: string, name: string, price: number, qty: number };
</script>
<div class="flex gap-4 border border-gray-200 p-4 bg-white">
  <div class="w-20 h-20 bg-gray-50 border border-gray-100 flex items-center justify-center text-[8px] font-mono text-gray-400 shrink-0">IMG</div>
  <div class="flex-1 flex flex-col justify-between">
    <div class="flex justify-between items-start">
      <h3 class="text-sm font-bold text-gray-900 leading-tight">{item.name}</h3>
      <button class="text-gray-400 hover:text-red-500 focus:outline-none text-[10px] font-mono uppercase">Remove</button>
    </div>
    <div class="flex justify-between items-end">
      <span class="text-xs font-mono text-gray-500">Qty: {item.qty}</span>
      <span class="text-sm font-bold text-gray-900 font-mono">${(item.price * item.qty).toFixed(2)}</span>
    </div>
  </div>
</div>
