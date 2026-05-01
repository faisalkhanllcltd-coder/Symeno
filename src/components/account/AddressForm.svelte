<script lang="ts">
  let {
    address = null,
    onSave,
    onCancel,
  } = $props<{
    address?: any;
    onSave: (data: any) => void;
    onCancel: () => void;
  }>();

  let formData = $state({
    id: address?.id || '',
    label: address?.label || 'Home',
    full_name: address?.full_name || '',
    phone: address?.phone || '',
    country: address?.country || 'United Arab Emirates', // Defaults to your primary market
    state: address?.state || 'Dubai',
    city: address?.city || '',
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    landmark: address?.landmark || '',
    is_default: address ? address.is_default === 1 : false,
  });

  const countries = [
    'United Arab Emirates',
    'United States',
    'Saudi Arabia',
    'United Kingdom',
    'Qatar',
    'Bahrain',
    'Oman',
  ];
  const emirates = [
    'Abu Dhabi',
    'Dubai',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah',
  ];

  let isUAE = $derived(formData.country === 'United Arab Emirates');

  // Auto-prefix phone numbers based on country if empty
  $effect(() => {
    if (!formData.phone) {
      if (formData.country === 'United Arab Emirates') formData.phone = '+971 ';
      if (formData.country === 'United States') formData.phone = '+1 ';
      if (formData.country === 'Saudi Arabia') formData.phone = '+966 ';
    }
  });

  function submit(e: Event) {
    e.preventDefault();
    onSave(formData);
  }
</script>

<form
  onsubmit={submit}
  class="space-y-6 border border-outline bg-surface p-6 transition-colors duration-300"
>
  <div class="flex items-center justify-between border-b border-outline pb-4">
    <h3
      class="font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      {address ? 'Edit Address' : 'New Address'}        
    </h3>
    <label class="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        bind:checked={formData.is_default}
        class="h-4 w-4 border-outline bg-base accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
      <span
        class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
        >Set as Default</span
      >
    </label>
  </div>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">   
    <div class="md:col-span-2">
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Address Label</label
      >
      <div class="flex gap-4">
        {#each ['Home', 'Work', 'Other'] as l}
          <label
            class="flex flex-1 cursor-pointer items-center justify-center gap-2 border p-2 transition-colors {formData.label ===
            l
              ? 'border-brand/30 bg-brand/10 text-brand'
              : 'border-outline bg-base text-content-muted hover:border-content-muted'}"
          >
            <input
              type="radio"
              value={l}
              bind:group={formData.label}
              class="hidden"
            />
            <span class="font-mono text-[10px] tracking-widest uppercase"
              >{l}</span
            >
          </label>
        {/each}
      </div>
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Recipient Full Name</label
      >
      <input
        type="text"
        bind:value={formData.full_name}
        required
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Phone Number</label
      >
      <input
        type="tel"
        bind:value={formData.phone}
        required
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Country</label
      >
      <select
        bind:value={formData.country}
        class="w-full cursor-pointer border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
      >
        {#each countries as c}
          <option value={c}>{c}</option>
        {/each}
      </select>
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >{isUAE ? 'Emirate' : 'State / Province'}</label
      >
      {#if isUAE}
        <select
          bind:value={formData.state}
          required
          class="w-full cursor-pointer border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
        >
          {#each emirates as emirate}
            <option value={emirate}>{emirate}</option>  
          {/each}
        </select>
      {:else}
        <input
          type="text"
          bind:value={formData.state}
          required
          placeholder="e.g. Wyoming, TX, ON"
          class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
        />
      {/if}
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >City / Area</label
      >
      <input
        type="text"
        bind:value={formData.city}
        required
        placeholder={isUAE ? 'e.g. Dubai Marina' : 'e.g. Cheyenne'}
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Street Name / No.</label
      >
      <input
        type="text"
        bind:value={formData.line1}
        required
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >{isUAE ? 'Building & Villa/Flat No.' : 'Apt, Suite, Unit'}</label
      >
      <input
        type="text"
        bind:value={formData.line2}
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
      />
    </div>

    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >{isUAE ? 'Nearest Landmark (Recommended)' : 'ZIP / Postal Code'}</label
      >
      <input
        type="text"
        bind:value={formData.landmark}
        required={!isUAE}
        placeholder={isUAE ? 'e.g. Behind Spinneys' : 'e.g. 82001'}
        class="w-full border border-outline bg-base p-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none transition-colors"
      />
    </div>
  </div>

  <div class="flex gap-4 border-t border-outline pt-4">
    <button
      type="button"
      onclick={onCancel}
      class="flex-1 border border-outline px-4 py-3 font-mono text-xs tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline rounded-sm"
      >Cancel</button
    >
    <button
      type="submit"
      class="flex-1 bg-brand px-4 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase shadow-[0_0_15px_var(--color-brand)] transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark rounded-sm"
      >Save Address</button
    >
  </div>
</form>
