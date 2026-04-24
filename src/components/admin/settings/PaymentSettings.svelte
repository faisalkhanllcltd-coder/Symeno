<script lang="ts">
  let codEnabled = $state(true);
  let tabbyEnabled = $state(false);
  let stripeMode = $state('test');
</script>

<div class="space-y-6 border border-white/10 bg-[#111318] p-6">
  <h2
    class="border-b border-white/10 pb-2 font-mono text-xs font-bold tracking-widest text-white uppercase"
  >
    Checkout Gateways
  </h2>

  <div
    class="flex items-center justify-between border border-[#36f4a4]/30 bg-[#36f4a4]/5 p-4"
  >
    <div>
      <h3 class="mb-1 text-xs font-bold text-white">Stripe Credit Cards</h3>
      <p class="font-mono text-[10px] text-white/50">
        pk_test_...512a (Read Only from ENV)
      </p>
    </div>
    <select
      bind:value={stripeMode}
      class="border border-white/10 bg-[#1A1D23] p-2 font-mono text-xs text-white focus:border-[#36f4a4]/50 focus:outline-none"
    >
      <option value="test">Test Mode</option>
      <option value="live">Live Production</option>
    </select>
  </div>

  <div
    class="flex items-center justify-between border border-amber-500/30 bg-amber-500/5 p-4"
  >
    <div>
      <h3 class="mb-1 text-xs font-bold text-white">Cash on Delivery (COD)</h3>
      <p class="font-mono text-[10px] text-white/50">
        Standard expectation for UAE/KSA markets.
      </p>
    </div>
    <label class="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" bind:checked={codEnabled} class="peer sr-only" />
      <div
        class="peer h-5 w-9 rounded-full bg-white/20 peer-checked:bg-amber-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
      ></div>
    </label>
  </div>

  <div
    class="flex items-center justify-between border border-purple-500/30 bg-purple-500/5 p-4"
  >
    <div>
      <h3 class="mb-1 text-xs font-bold text-white">Tabby / Tamara BNPL</h3>
      <p class="font-mono text-[10px] text-white/50">
        Buy Now, Pay Later integration.
      </p>
    </div>
    <label class="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" bind:checked={tabbyEnabled} class="peer sr-only" />
      <div
        class="peer h-5 w-9 rounded-full bg-white/20 peer-checked:bg-purple-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
      ></div>
    </label>
  </div>
</div>
