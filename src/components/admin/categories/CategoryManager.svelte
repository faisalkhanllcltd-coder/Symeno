<script lang="ts">
  import { onMount } from 'svelte';

  type Category = { id: string; name: string; slug: string; created_at: string };
  
  let categories: Category[] = [];
  let newCategoryName = '';
  let isLoading = true;
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';

  async function fetchCategories() {
    isLoading = true;
    errorMessage = '';
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error('Failed to load categories');
      categories = await res.json();
    } catch (err: any) {
      errorMessage = err.message;
    } finally {
      isLoading = false;
    }
  }

  async function handleAddCategory(e: Event) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    isSubmitting = true;
    errorMessage = '';
    successMessage = '';

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to create category');

      successMessage = `Category "${data.name}" created successfully.`;
      newCategoryName = '';
      await fetchCategories(); // Refresh list
    } catch (err: any) {
      errorMessage = err.message;
    } finally {
      isSubmitting = false;
      setTimeout(() => successMessage = '', 4000); // Clear success message after 4s
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    errorMessage = '';
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      categories = categories.filter(c => c.id !== id);
    } catch (err: any) {
      errorMessage = err.message;
    }
  }

  onMount(() => {
    fetchCategories();
  });
</script>

<div class="max-w-4xl mx-auto space-y-8">
  
  {#if errorMessage}
    <div class="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded shadow-sm">
      <p class="font-medium">{errorMessage}</p>
    </div>
  {/if}
  {#if successMessage}
    <div class="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded shadow-sm">
      <p class="font-medium">{successMessage}</p>
    </div>
  {/if}

  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 class="text-lg font-bold text-gray-900 mb-4">Create New Category</h2>
    <form on:submit={handleAddCategory} class="flex gap-4 items-end">
      <div class="flex-1">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
        <input 
          type="text" 
          id="name" 
          bind:value={newCategoryName} 
          placeholder="e.g. Desk Organization"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          disabled={isSubmitting}
        />
      </div>
      <button 
        type="submit" 
        disabled={isSubmitting || !newCategoryName.trim()}
        class="px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? 'Saving...' : 'Add Category'}
      </button>
    </form>
  </div>

  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
      <h2 class="text-lg font-bold text-gray-900">Active Categories</h2>
      <span class="text-sm text-gray-500 font-medium">{categories.length} Total</span>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
            <th class="px-6 py-3 font-medium">Name</th>
            <th class="px-6 py-3 font-medium">URL Slug</th>
            <th class="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          {#if isLoading}
            <tr>
              <td colspan="3" class="px-6 py-8 text-center text-gray-500">Loading categories...</td>
            </tr>
          {:else if categories.length === 0}
            <tr>
              <td colspan="3" class="px-6 py-8 text-center text-gray-500">No categories found. Create one above.</td>
            </tr>
          {:else}
            {#each categories as category}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                <td class="px-6 py-4 text-gray-500 font-mono text-sm">/{category.slug}</td>
                <td class="px-6 py-4 text-right">
                  <button 
                    on:click={() => handleDeleteCategory(category.id, category.name)}
                    class="text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</div>
