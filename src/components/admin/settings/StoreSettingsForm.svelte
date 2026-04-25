<script lang="ts">
  let { initialSettings = {} } = $props<{ initialSettings?: any }>();

  let name = $state(initialSettings.name || 'Symeno Storefront');
  let currency = $state(initialSettings.currency || 'AED');
  let timezone = $state(initialSettings.timezone || 'Asia/Dubai');
  let logoUrl = $state(initialSettings.logoUrl || '');
  let isSubmitting = $state(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, currency, timezone, logoUrl }),
      });
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form
  onsubmit={handleSubmit}
  class="space-y-6 border border-outline bg-surface p-6 sm:p-8"
>
  <h2
    class="border-b border-outline pb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
  >
    General Identity
  </h2>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Store Name</label
      >
      <input
        type="text"
        bind:value={name}
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Logo URL (R2)</label
      >
      <input
        type="text"
        bind:value={logoUrl}
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Base Currency</label
      >
      <select
        bind:value={currency}
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        <option value="AED">AED - UAE Dirham</option>
        <option value="SAR">SAR - Saudi Riyal</option>
        <option value="USD">USD - US Dollar</option>
      </select>
    </div>
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >Timezone</label
      >
      <select
        bind:value={timezone}
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >
        <option value="Asia/Dubai">GST (Asia/Dubai)</option>
        <option value="Asia/Riyadh">AST (Asia/Riyadh)</option>
      </select>
    </div>
  </div>

  <div class="flex justify-end border-t border-outline pt-4">
    <button
      type="submit"
      disabled={isSubmitting}
      class="bg-brand px-6 py-2 text-[10px] font-bold tracking-widest text-black uppercase transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm disabled:opacity-50"
    >
      {isSubmitting ? 'Saving...' : 'Save Configuration'}
    </button>
  </div>
</form>
