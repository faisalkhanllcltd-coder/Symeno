<script lang="ts">
  let { user = {} } = $props<{ user?: any }>();
  let isSubmitting = $state(false);

  let formData = $state({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
    gender: user?.gender || '',
    avatar_url: user?.avatar_url || '',
  });

  async function handleSave(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      const res = await fetch('/api/account/profile', { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) alert('Identity synchronized.');      
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSave} class="animate-fade-in space-y-6 transition-colors duration-300">
  <div class="mb-8 flex items-center gap-6">
    <div
      class="group relative h-24 w-24 overflow-hidden rounded-full border border-outline bg-base"
    >
      {#if formData.avatar_url}
        <img
          src={formData.avatar_url}
          alt="Avatar"
          class="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-50"
        />
      {:else}
        <div
          class="flex h-full w-full items-center justify-center font-mono text-2xl text-content-muted uppercase"     
        >
          {formData.first_name?.charAt(0) || 'U'}       
        </div>
      {/if}
      <div
        class="absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
      >
        <span
          class="font-mono text-[10px] font-bold tracking-widest text-content uppercase"
          >Upload</span
        >
      </div>
    </div>
    <div>
      <h3 class="text-xs font-bold tracking-widest text-content uppercase">
        Profile Visual
      </h3>
      <p class="mt-1 font-mono text-[10px] text-content-muted">
        Accepts JPG, PNG. Max 2MB.
      </p>
      <input
        type="text"
        bind:value={formData.avatar_url}
        placeholder="R2 Image URL..."
        class="mt-2 w-full max-w-xs border border-outline bg-base px-3 py-1.5 font-mono text-xs text-content focus:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors"
      />
    </div>
  </div>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">   
    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >First Name</label
      >
      <input
        type="text"
        bind:value={formData.first_name}
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors"
      />
    </div>
    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Last Name</label
      >
      <input
        type="text"
        bind:value={formData.last_name}
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors"
      />
    </div>
    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Phone Vector</label
      >
      <input
        type="tel"
        bind:value={formData.phone}
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors"
      />
    </div>
    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Date of Birth</label
      >
      <input
        type="date"
        bind:value={formData.dob}
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors"
      />
    </div>
    <div>
      <label
        class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
        >Gender (Optional)</label
      >
      <select
        bind:value={formData.gender}
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand transition-colors cursor-pointer"
      >
        <option value="">Prefer not to state</option>   
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
  </div>

  <div class="flex justify-end border-t border-outline pt-4">
    <button
      type="submit"
      disabled={isSubmitting}
      class="bg-brand px-8 py-3 text-xs font-bold tracking-widest text-brand-dark uppercase transition-colors hover:opacity-80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      {isSubmitting ? 'Syncing...' : 'Update Identity'} 
    </button>
  </div>
</form>
