<script lang="ts">
  let { initialData = {}, isEdit = false } = $props<{
    initialData?: any;
    isEdit?: boolean;
  }>();

  let id = $state(initialData.id || '');
  let name = $state(initialData.name || '');
  let slug = $state(initialData.slug || '');
  let description = $state(initialData.description || '');
  let logo_url = $state(initialData.logo_url || '');
  let cover_url = $state(initialData.cover_url || '');
  let country = $state(initialData.country || '');
  let website_url = $state(initialData.website_url || '');
  let is_featured = $state(
    initialData.is_featured === 1 || initialData.is_featured === true
  );
  let seo_title = $state(initialData.seo_title || '');
  let seo_description = $state(initialData.seo_description || '');

  let isSubmitting = $state(false);

  // Auto-slug generation
  $effect(() => {
    if (name && !isEdit && !slug) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
  });

  async function submitForm(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      const endpoint = isEdit ? `/api/admin/brands/${id}` : '/api/admin/brands';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          logo_url,
          cover_url,
          country,
          website_url,
          is_featured,
          seo_title,
          seo_description,
        }),
      });

      if (res.ok) {
        window.location.href = '/admin/brands';
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={submitForm} class="max-w-4xl space-y-6">
  <div class="border border-outline bg-surface p-6 sm:p-8">
    <div
      class="mb-6 flex items-center justify-between border-b border-outline pb-2"
    >
      <h2
        class="font-mono text-xs font-bold tracking-widest text-content uppercase"
      >
        Brand Identity
      </h2>
      <label class="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          bind:checked={is_featured}
          class="h-4 w-4 border-outline bg-base accent-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
        <span
          class="font-mono text-[10px] tracking-widest text-content-muted uppercase"
          >Featured Brand</span
        >
      </label>
    </div>

    <div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
      <div class="sm:col-span-3">
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Brand Name</label
        >
        <input
          type="text"
          bind:value={name}
          required
          class="block w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>

      <div class="sm:col-span-3">
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >URL Slug</label
        >
        <div class="flex">
          <span
            class="border border-r-0 border-outline bg-surface px-3 py-2 font-mono text-sm text-content-muted select-none"
            >/brands/</span
          >
          <input
            type="text"
            bind:value={slug}
            required
            class="flex-1 border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
          />
        </div>
      </div>

      <div class="sm:col-span-6">
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Description / Manifesto</label
        >
        <textarea
          bind:value={description}
          rows="4"
          class="block w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        ></textarea>
      </div>

      <div class="sm:col-span-3">
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Country of Origin</label
        >
        <input
          type="text"
          bind:value={country}
          placeholder="e.g. Japan, Germany, USA"
          class="block w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>

      <div class="sm:col-span-3">
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Official Website</label
        >
        <input
          type="url"
          bind:value={website_url}
          placeholder="https://"
          class="block w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>
    </div>
  </div>

  <div class="border border-outline bg-surface p-6 sm:p-8">
    <h2
      class="mb-6 border-b border-outline pb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      Media Assets (R2)
    </h2>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Brand Logo URL</label
        >
        <input
          type="text"
          bind:value={logo_url}
          placeholder="/cdn/images/logo.png"
          class="mb-2 block w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
        {#if logo_url}<img
            src={logo_url}
            alt="Logo Preview"
            class="h-16 border border-outline bg-white/5 object-contain p-2"
          />{/if}
      </div>
      <div>
        <label
          class="mb-2 block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
          >Hero Cover URL</label
        >
        <input
          type="text"
          bind:value={cover_url}
          placeholder="/cdn/images/cover.jpg"
          class="mb-2 block w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
        {#if cover_url}<img
            src={cover_url}
            alt="Cover Preview"
            class="h-16 w-full border border-outline bg-white/5 object-cover"
          />{/if}
      </div>
    </div>
  </div>

  <div class="border border-outline bg-surface p-6 sm:p-8">
    <h2
      class="mb-6 border-b border-outline pb-2 font-mono text-xs font-bold tracking-widest text-content uppercase"
    >
      Search Engine Optimization
    </h2>
    <div class="space-y-4">
      <div>
        <div class="mb-2 flex justify-between">
          <label
            class="block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
            >Meta Title</label
          >
          <span
            class="font-mono text-[10px] {seo_title.length > 60
              ? 'text-amber-400'
              : 'text-content-muted'}">{seo_title.length}/60</span
          >
        </div>
        <input
          type="text"
          bind:value={seo_title}
          maxlength="70"
          class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>

      <div>
        <div class="mb-2 flex justify-between">
          <label
            class="block font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
            >Meta Description</label
          >
          <span
            class="font-mono text-[10px] {seo_description.length > 160
              ? 'text-amber-400'
              : 'text-content-muted'}">{seo_description.length}/160</span
          >
        </div>
        <textarea
          bind:value={seo_description}
          rows="3"
          maxlength="320"
          class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        ></textarea>
      </div>
    </div>
  </div>

  <div class="flex justify-end gap-4 pt-4">
    <a
      href="/admin/brands"
      class="border border-outline px-6 py-3 text-xs font-bold tracking-widest text-content uppercase transition-colors hover:bg-white/5 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      >Abort</a
    >
    <button
      type="submit"
      disabled={isSubmitting}
      class="bg-brand px-8 py-3 text-xs font-bold tracking-widest text-black uppercase shadow-[0_0_15px_rgba(54,244,164,0.15)] transition-colors hover:bg-white focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm disabled:opacity-50"
    >
      {isSubmitting ? 'Committing...' : isEdit ? 'Update Brand' : 'Save Brand'}
    </button>
  </div>
</form>
