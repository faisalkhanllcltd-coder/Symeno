<script lang="ts">
  let { title = $bindable(), description = $bindable(), slug = $bindable() } = $props<{ title: string, description: string, slug: string }>();

  // Auto-generate slug from title if slug is empty
  $effect(() => {
    if (title && !slug) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
  });
</script>

<div class="bg-[#111318] p-6 border border-white/10">
  <h3 class="text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-6">Search Engine Optimization</h3>
  
  <div class="space-y-4">
    <div>
      <label class="block text-[10px] text-white/50 font-mono mb-2">URL Slug</label>
      <div class="flex">
        <span class="bg-[#0a0b0e] border border-r-0 border-white/10 text-white/30 px-3 py-2 text-sm font-mono select-none">/shop/</span>
        <input type="text" bind:value={slug} class="flex-1 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
      </div>
    </div>

    <div>
      <div class="flex justify-between mb-2">
        <label class="block text-[10px] text-white/50 font-mono">Meta Title</label>
        <span class="text-[10px] font-mono {title.length > 60 ? 'text-amber-400' : 'text-white/30'}">{title.length}/60</span>
      </div>
      <input type="text" bind:value={title} maxlength="70" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <div class="flex justify-between mb-2">
        <label class="block text-[10px] text-white/50 font-mono">Meta Description</label>
        <span class="text-[10px] font-mono {description.length > 160 ? 'text-amber-400' : 'text-white/30'}">{description.length}/160</span>
      </div>
      <textarea bind:value={description} rows="3" maxlength="320" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono"></textarea>
    </div>

    <div class="mt-6 p-4 bg-white/[0.02] border border-white/5">
      <p class="text-[10px] font-mono text-white/30 mb-2 uppercase tracking-widest">Google Preview</p>
      <div class="text-[#8ab4f8] text-sm hover:underline cursor-pointer truncate">{title || 'Product Title'} | Symeno</div>
      <div class="text-[#008f26] text-xs truncate">symeno.com/shop/{slug || 'product-slug'}</div>
      <div class="text-[#bdc1c6] text-xs mt-1 line-clamp-2">{description || 'Product description will appear here in search results.'}</div>
    </div>
  </div>
</div>