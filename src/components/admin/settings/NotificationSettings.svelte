<script lang="ts">
  let emailBcc = $state(true);
  let triggers = $state([
    { id: 'order_conf', label: 'Order Confirmation', active: true },
    { id: 'ship_conf', label: 'Shipping Dispatch', active: true },
    { id: 'delivery', label: 'Delivery Complete', active: false },
    { id: 'return', label: 'Return Approved', active: true },
  ]);
</script>

<div class="space-y-6 border border-outline bg-surface p-6">
  <h2
    class="border-b border-outline pb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
  >
    Email Triggers (Resend)
  </h2>

  <div class="space-y-3">
    {#each triggers as t}
      <label
        class="flex cursor-pointer items-center gap-3 p-2 transition-colors hover:bg-white/5"
      >
        <input
          type="checkbox"
          bind:checked={t.active}
          class="h-4 w-4 border-outline bg-base accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
        <span class="font-mono text-[10px] text-content-muted uppercase"
          >{t.label}</span
        >
      </label>
    {/each}
  </div>

  <div class="mt-4 border-t border-outline pt-4">
    <label class="flex cursor-pointer items-center gap-3 p-2">
      <input
        type="checkbox"
        bind:checked={emailBcc}
        class="h-4 w-4 border-outline bg-base accent-amber-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
      />
      <span
        class="font-mono text-[10px] tracking-widest text-amber-400 uppercase"
        >BCC Admin on all outbound comms</span
      >
    </label>
  </div>
</div>
