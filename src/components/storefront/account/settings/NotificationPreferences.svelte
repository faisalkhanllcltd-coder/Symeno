<script lang="ts">
  let prefs = $state({
    orders: true,
    shipping: true,
    promotions: false,
    priceDrops: true
  });
</script>

<div class="space-y-8 animate-fade-in">
  <div>
    <h3 class="text-xs font-bold uppercase tracking-widest text-white font-mono mb-2">Email Telemetry</h3>
    <p class="text-[10px] text-white/50 font-mono mb-6 max-w-md">Configure which alerts are transmitted to your registered email vector.</p>
  </div>

  <div class="space-y-4 max-w-2xl">
    <label class="flex items-center justify-between p-4 border border-white/10 bg-[#1A1D23] cursor-pointer hover:border-[#36f4a4]/50 transition-colors">
      <div>
        <h4 class="text-xs font-bold text-white">Order Confirmations</h4>
        <p class="text-[10px] text-white/50 font-mono mt-1">Receipts and immediate transaction feedback.</p>
      </div>
      <input type="checkbox" bind:checked={prefs.orders} disabled class="accent-[#36f4a4] w-5 h-5 opacity-50 cursor-not-allowed" title="Required for system operation" />
    </label>

    <label class="flex items-center justify-between p-4 border border-white/10 bg-[#1A1D23] cursor-pointer hover:border-[#36f4a4]/50 transition-colors">
      <div>
        <h4 class="text-xs font-bold text-white">Logistics & Shipping</h4>
        <p class="text-[10px] text-white/50 font-mono mt-1">Dispatch alerts and tracking URL deliveries.</p>
      </div>
      <input type="checkbox" bind:checked={prefs.shipping} class="accent-[#36f4a4] w-5 h-5" />
    </label>

    <label class="flex items-center justify-between p-4 border border-white/10 bg-[#1A1D23] cursor-pointer hover:border-[#36f4a4]/50 transition-colors">
      <div>
        <h4 class="text-xs font-bold text-white">Price Drops & Back-in-Stock</h4>
        <p class="text-[10px] text-white/50 font-mono mt-1">Alerts for items in your Wishlist matrix.</p>
      </div>
      <input type="checkbox" bind:checked={prefs.priceDrops} class="accent-[#36f4a4] w-5 h-5" />
    </label>

    <label class="flex items-center justify-between p-4 border border-white/10 bg-[#1A1D23] cursor-pointer hover:border-[#36f4a4]/50 transition-colors">
      <div>
        <h4 class="text-xs font-bold text-white">Marketing & Promotions</h4>
        <p class="text-[10px] text-white/50 font-mono mt-1">Exclusive drops, VIP access, and general broadcasts.</p>
      </div>
      <input type="checkbox" bind:checked={prefs.promotions} class="accent-[#36f4a4] w-5 h-5" />
    </label>
  </div>
</div>