<script lang="ts">
  let { initialData = {}, isEdit = false } = $props<{ initialData: any, isEdit?: boolean }>();
  
  let id = $state(initialData.id || '');
  let name = $state(initialData.name || '');
  let slug = $state(initialData.slug || '');
  let description = $state(initialData.description || '');
  let logo_url = $state(initialData.logo_url || '');
  let cover_url = $state(initialData.cover_url || '');
  let country = $state(initialData.country || '');
  let website_url = $state(initialData.website_url || '');
  let is_featured = $state(initialData.is_featured === 1 || initialData.is_featured === true);
  let seo_title = $state(initialData.seo_title || '');
  let seo_description = $state(initialData.seo_description || '');
  
  let isSubmitting = $state(false);

  // Auto-slug generation
  $effect(() => {
    if (name && !isEdit && !slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
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
          name, slug, description, logo_url, cover_url, country, website_url, is_featured, seo_title, seo_description
        })
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
  
  <div class="bg-[#111318] p-6 sm:p-8 border border-white/10">
    <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
      <h2 class="text-xs font-bold text-white font-mono uppercase tracking-widest">Brand Identity</h2>
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" bind:checked={is_featured} class="w-4 h-4 accent-[#36f4a4] bg-[#1A1D23] border-white/10" />
        <span class="text-[10px] font-mono text-white/70 uppercase tracking-widest">Featured Brand</span>
      </label>
    </div>
    
    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
      <div class="sm:col-span-3">
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Brand Name</label>
        <input type="text" bind:value={name} required class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
      </div>

      <div class="sm:col-span-3">
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">URL Slug</label>
        <div class="flex">
          <span class="bg-[#0a0b0e] border border-r-0 border-white/10 text-white/30 px-3 py-2 text-sm font-mono select-none">/brands/</span>
          <input type="text" bind:value={slug} required class="flex-1 bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
        </div>
      </div>

      <div class="sm:col-span-6">
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Description / Manifesto</label>
        <textarea bind:value={description} rows="4" class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono"></textarea>
      </div>

      <div class="sm:col-span-3">
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Country of Origin</label>
        <input type="text" bind:value={country} placeholder="e.g. Japan, Germany, USA" class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
      </div>

      <div class="sm:col-span-3">
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Official Website</label>
        <input type="url" bind:value={website_url} placeholder="https://" class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
      </div>
    </div>
  </div>

  <div class="bg-[#111318] p-6 sm:p-8 border border-white/10">
    <h2 class="text-xs font-bold text-white font-mono uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Media Assets (R2)</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Brand Logo URL</label>
        <input type="text" bind:value={logo_url} placeholder="/cdn/images/logo.png" class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono mb-2" />
        {#if logo_url}<img src={logo_url} alt="Logo Preview" class="h-16 object-contain border border-white/10 p-2 bg-white/5" />{/if}
      </div>
      <div>
        <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Hero Cover URL</label>
        <input type="text" bind:value={cover_url} placeholder="/cdn/images/cover.jpg" class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono mb-2" />
        {#if cover_url}<img src={cover_url} alt="Cover Preview" class="h-16 w-full object-cover border border-white/10 bg-white/5" />{/if}
      </div>
    </div>
  </div>

  <div class="bg-[#111318] p-6 sm:p-8 border border-white/10">
    <h2 class="text-xs font-bold text-white font-mono uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Search Engine Optimization</h2>
    <div class="space-y-4">
      <div>
        <div class="flex justify-between mb-2">
          <label class="block text-[10px] text-white/50 font-mono font-bold uppercase tracking-widest">Meta Title</label>
          <span class="text-[10px] font-mono {seo_title.length > 60 ? 'text-amber-400' : 'text-white/30'}">{seo_title.length}/60</span>
        </div>
        <input type="text" bind:value={seo_title} maxlength="70" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
      </div>

      <div>
        <div class="flex justify-between mb-2">
          <label class="block text-[10px] text-white/50 font-mono font-bold uppercase tracking-widest">Meta Description</label>
          <span class="text-[10px] font-mono {seo_description.length > 160 ? 'text-amber-400' : 'text-white/30'}">{seo_description.length}/160</span>
        </div>
        <textarea bind:value={seo_description} rows="3" maxlength="320" class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono"></textarea>
      </div>
    </div>
  </div>

  <div class="flex justify-end gap-4 pt-4">
    <a href="/admin/brands" class="border border-white/10 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors focus:outline-none">Abort</a>
    <button type="submit" disabled={isSubmitting} class="bg-[#36f4a4] text-[#003822] px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors focus:outline-none shadow-[0_0_15px_rgba(54,244,164,0.15)] disabled:opacity-50">
      {isSubmitting ? 'Committing...' : (isEdit ? 'Update Brand' : 'Save Brand')}
    </button>
  </div>
</form>