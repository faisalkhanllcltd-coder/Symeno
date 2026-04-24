<script lang="ts">
  let prefs = $state({
    orders: true,
    shipping: true,
    promotions: false,
    priceDrops: true,
  });
</script>

<div class="animate-fade-in space-y-8 transition-colors duration-300">
  <div>
    <h3
      class="mb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      Email Telemetry
    </h3>
    <p class="mb-6 max-w-md font-mono text-[10px] text-content-muted">
      Configure which alerts are transmitted to your registered email vector.
    </p>
  </div>

  <div class="max-w-2xl space-y-4">
    <label
      class="flex cursor-pointer items-center justify-between border border-outline bg-base p-4 transition-colors hover:border-brand/50 group"
    >
      <div>
        <h4 class="text-xs font-bold text-content transition-colors group-hover:text-brand">Order Confirmations</h4>
        <p class="mt-1 font-mono text-[10px] text-content-muted">
          Receipts and immediate transaction feedback.  
        </p>
      </div>
      <input
        type="checkbox"
        bind:checked={prefs.orders}
        disabled
        class="h-5 w-5 cursor-not-allowed accent-brand opacity-50"
        title="Required for system operation"
      />
    </label>

    <label
      class="flex cursor-pointer items-center justify-between border border-outline bg-base p-4 transition-colors hover:border-brand/50 group"
    >
      <div>
        <h4 class="text-xs font-bold text-content transition-colors group-hover:text-brand">Logistics & Shipping</h4>
        <p class="mt-1 font-mono text-[10px] text-content-muted">
          Dispatch alerts and tracking URL deliveries.  
        </p>
      </div>
      <input
        type="checkbox"
        bind:checked={prefs.shipping}
        class="h-5 w-5 accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </label>

    <label
      class="flex cursor-pointer items-center justify-between border border-outline bg-base p-4 transition-colors hover:border-brand/50 group"
    >
      <div>
        <h4 class="text-xs font-bold text-content transition-colors group-hover:text-brand">        
          Price Drops & Back-in-Stock
        </h4>
        <p class="mt-1 font-mono text-[10px] text-content-muted">
          Alerts for items in your Wishlist matrix.     
        </p>
      </div>
      <input
        type="checkbox"
        bind:checked={prefs.priceDrops}
        class="h-5 w-5 accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </label>

    <label
      class="flex cursor-pointer items-center justify-between border border-outline bg-base p-4 transition-colors hover:border-brand/50 group"
    >
      <div>
        <h4 class="text-xs font-bold text-content transition-colors group-hover:text-brand">Marketing & Promotions</h4>
        <p class="mt-1 font-mono text-[10px] text-content-muted">
          Exclusive drops, VIP access, and general broadcasts.
        </p>
      </div>
      <input
        type="checkbox"
        bind:checked={prefs.promotions}
        class="h-5 w-5 accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </label>
  </div>
</div>
