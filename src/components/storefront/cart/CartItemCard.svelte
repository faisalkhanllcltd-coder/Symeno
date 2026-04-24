<script lang="ts">
  export let item: { id: string; name: string; price: number; qty: number };
</script>

<div class="flex gap-4 border border-gray-200 bg-white p-4">
  <div
    class="flex h-20 w-20 shrink-0 items-center justify-center border border-gray-100 bg-gray-50 font-mono text-[8px] text-gray-400"
  >
    IMG
  </div>
  <div class="flex flex-1 flex-col justify-between">
    <div class="flex items-start justify-between">
      <h3 class="text-sm leading-tight font-bold text-gray-900">{item.name}</h3>
      <button
        class="font-mono text-[10px] text-gray-400 uppercase hover:text-red-500 focus:outline-none"
        >Remove</button
      >
    </div>
    <div class="flex items-end justify-between">
      <span class="font-mono text-xs text-gray-500">Qty: {item.qty}</span>
      <span class="font-mono text-sm font-bold text-gray-900"
        >${(item.price * item.qty).toFixed(2)}</span
      >
    </div>
  </div>
</div>
