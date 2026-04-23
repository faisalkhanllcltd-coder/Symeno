<script lang="ts">
  let { category = null, categories = [], onSave, onCancel } = $props<{ category: any, categories: any[], onSave: () => void, onCancel: () => void }>();
  
  let id = $state(category?.id || '');
  let parent_id = $state(category?.parent_id || '');
  let name = $state(category?.name || '');
  let slug = $state(category?.slug || '');
  let description = $state(category?.description || '');
  let image_url = $state(category?.image_url || '');
  let is_active = $state(category ? category.is_active === 1 : true);
  let seo_title = $state(category?.seo_title || '');
  
  let isSubmitting = $state(false);

  // Auto-slug
  $effect(() => {
    if (name && !category?.id && !slug) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
  });

  // Filter available parents (can't be self, can't be children to prevent loops)
  let availableParents = $derived(categories.filter(c => c.id !== id && !c.parent_id));

  async function submitForm(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    try {
      const endpoint = id ? `/api/admin/categories/${id}` : '/api/admin/categories';
      const method = id ? 'PUT' : 'POST';
      
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_id, name, slug, description, image_url, is_active, seo_title, sort_order: 0 })
      });
      
      if (res.ok) {
        onSave();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={submitForm} class="bg-[#111318] border border-white/10 p-6 space-y-6 h-full flex flex-col">
  <div class="flex justify-between items-center border-b border-white/10 pb-4">
    <h3 class="text-xs font-bold text-white font-mono uppercase tracking-widest">{id ? 'Edit Taxonomy' : 'New Node'}</h3>
    <label class="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" bind:checked={is_active} class="w-4 h-4 accent-[#36f4a4] bg-[#1A1D23] border-white/10" />
      <span class="text-[10px] font-mono text-white/70 uppercase tracking-widest">Visible</span>
    </label>
  </div>
  
  <div class="flex-1 space-y-4 overflow-y-auto pr-2">
    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Node Name</label>
      <input type="text" bind:value={name} required class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Parent Node</label>
      <select bind:value={parent_id} class="w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono cursor-pointer">
        <option value="">-- None (Root Level) --</option>
        {#each availableParents as p}
          <option value={p.id}>{p.name}</option>
        {/each}
      </select>
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">URL Slug</label>
      <input type="text" bind:value={slug} required class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">Cover Asset URL</label>
      <input type="text" bind:value={image_url} class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>

    <div>
      <label class="block text-[10px] font-bold uppercase tracking-widest text-white/50 font-mono mb-2">SEO Title</label>
      <input type="text" bind:value={seo_title} class="block w-full bg-[#1A1D23] border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-[#36f4a4]/50 font-mono" />
    </div>
  </div>

  <div class="flex gap-2 pt-4 border-t border-white/10">
    <button type="button" onclick={onCancel} class="flex-1 border border-white/10 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors focus:outline-none">Cancel</button>
    <button type="submit" disabled={isSubmitting} class="flex-1 bg-[#36f4a4] text-[#003822] px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors focus:outline-none disabled:opacity-50">
      {isSubmitting ? 'Saving...' : 'Commit Node'}
    </button>
  </div>
</form>