<script lang="ts">
  let codEnabled = $state(true);
  let tabbyEnabled = $state(false);
  let stripeMode = $state('test');
</script>

<div class="bg-[#111318] p-6 border border-white/10 space-y-6">
  <h2 class="text-xs font-bold text-white font-mono uppercase tracking-widest border-b border-white/10 pb-2">Checkout Gateways</h2>
  
  <div class="p-4 border border-[#36f4a4]/30 bg-[#36f4a4]/5 flex justify-between items-center">
    <div>
      <h3 class="text-xs font-bold text-white mb-1">Stripe Credit Cards</h3>
      <p class="text-[10px] text-white/50 font-mono">pk_test_...512a (Read Only from ENV)</p>
    </div>
    <select bind:value={stripeMode} class="bg-[#1A1D23] border border-white/10 text-white p-2 text-xs focus:outline-none focus:border-[#36f4a4]/50 font-mono">
      <option value="test">Test Mode</option>
      <option value="live">Live Production</option>
    </select>
  </div>

  <div class="p-4 border border-amber-500/30 bg-amber-500/5 flex justify-between items-center">
    <div>
      <h3 class="text-xs font-bold text-white mb-1">Cash on Delivery (COD)</h3>
      <p class="text-[10px] text-white/50 font-mono">Standard expectation for UAE/KSA markets.</p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" bind:checked={codEnabled} class="sr-only peer">
      <div class="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
    </label>
  </div>

  <div class="p-4 border border-purple-500/30 bg-purple-500/5 flex justify-between items-center">
    <div>
      <h3 class="text-xs font-bold text-white mb-1">Tabby / Tamara BNPL</h3>
      <p class="text-[10px] text-white/50 font-mono">Buy Now, Pay Later integration.</p>
    </div>
    <label class="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" bind:checked={tabbyEnabled} class="sr-only peer">
      <div class="w-9 h-5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
    </label>
  </div>
</div>