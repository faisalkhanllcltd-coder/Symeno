<script lang="ts">
  let codEnabled = $state(true);
  let tabbyEnabled = $state(false);
  let stripeMode = $state('test');
</script>

<div class="space-y-6 border border-outline bg-surface p-6">
  <h2
    class="border-b border-outline pb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
  >
    Checkout Gateways
  </h2>

  <div
    class="flex items-center justify-between border border-brand/30 bg-brand/5 p-4"
  >
    <div>
      <h3 class="mb-1 text-xs font-bold text-content">Stripe Credit Cards</h3>
      <p class="font-mono text-[10px] text-content-muted">
        pk_test_...512a (Read Only from ENV)
      </p>
    </div>
    <select
      bind:value={stripeMode}
      class="border border-outline bg-base p-2 font-mono text-xs text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      <option value="test">Test Mode</option>
      <option value="live">Live Production</option>
    </select>
  </div>

  <div
    class="flex items-center justify-between border border-amber-500/30 bg-amber-500/5 p-4"
  >
    <div>
      <h3 class="mb-1 text-xs font-bold text-content">Cash on Delivery (COD)</h3>
      <p class="font-mono text-[10px] text-content-muted">
        Standard expectation for UAE/KSA markets.
      </p>
    </div>
    <label class="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" bind:checked={codEnabled} class="peer sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm" />
      <div
        class="peer h-5 w-9 rounded-full bg-white/20 peer-checked:bg-amber-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
      ></div>
    </label>
  </div>

  <div
    class="flex items-center justify-between border border-purple-500/30 bg-purple-500/5 p-4"
  >
    <div>
      <h3 class="mb-1 text-xs font-bold text-content">Tabby / Tamara BNPL</h3>
      <p class="font-mono text-[10px] text-content-muted">
        Buy Now, Pay Later integration.
      </p>
    </div>
    <label class="relative inline-flex cursor-pointer items-center">
      <input type="checkbox" bind:checked={tabbyEnabled} class="peer sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-sm" />
      <div
        class="peer h-5 w-9 rounded-full bg-white/20 peer-checked:bg-purple-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
      ></div>
    </label>
  </div>
</div>
