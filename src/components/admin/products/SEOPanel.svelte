<script lang="ts">
  let {
    title = $bindable(),
    description = $bindable(),
    slug = $bindable(),
  } = $props<{ title: string; description: string; slug: string }>();

  // Auto-generate slug from title if slug is empty
  $effect(() => {
    if (title && !slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
  });
</script>

<div class="border border-outline bg-surface p-6">
  <h3
    class="mb-6 font-mono text-[10px] font-bold tracking-widest text-content-muted uppercase"
  >
    Search Engine Optimization
  </h3>

  <div class="space-y-4">
    <div>
      <label class="mb-2 block font-mono text-[10px] text-content-muted"
        >URL Slug</label
      >
      <div class="flex">
        <span
          class="border border-r-0 border-outline bg-surface px-3 py-2 font-mono text-sm text-content-muted select-none"
          >/shop/</span
        >
        <input
          type="text"
          bind:value={slug}
          class="flex-1 border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
        />
      </div>
    </div>

    <div>
      <div class="mb-2 flex justify-between">
        <label class="block font-mono text-[10px] text-content-muted"
          >Meta Title</label
        >
        <span
          class="font-mono text-[10px] {title.length > 60
            ? 'text-amber-400'
            : 'text-content-muted'}">{title.length}/60</span
        >
      </div>
      <input
        type="text"
        bind:value={title}
        maxlength="70"
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      />
    </div>

    <div>
      <div class="mb-2 flex justify-between">
        <label class="block font-mono text-[10px] text-content-muted"
          >Meta Description</label
        >
        <span
          class="font-mono text-[10px] {description.length > 160
            ? 'text-amber-400'
            : 'text-content-muted'}">{description.length}/160</span
        >
      </div>
      <textarea
        bind:value={description}
        rows="3"
        maxlength="320"
        class="w-full border border-outline bg-base px-3 py-2 font-mono text-sm text-content focus:border-brand/50 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
      ></textarea>
    </div>

    <div class="mt-6 border border-outline bg-white/[0.02] p-4">
      <p
        class="mb-2 font-mono text-[10px] tracking-widest text-content-muted uppercase"
      >
        Google Preview
      </p>
      <div
        class="cursor-pointer truncate text-sm text-[#8ab4f8] hover:underline"
      >
        {title || 'Product Title'} | Symeno
      </div>
      <div class="truncate text-xs text-[#008f26]">
        symeno.com/shop/{slug || 'product-slug'}
      </div>
      <div class="mt-1 line-clamp-2 text-xs text-[#bdc1c6]">
        {description ||
          'Product description will appear here in search results.'}
      </div>
    </div>
  </div>
</div>
