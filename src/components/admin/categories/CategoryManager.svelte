<script lang="ts">
  import { onMount } from 'svelte';

  type Category = {
    id: string;
    name: string;
    slug: string;
    created_at: string;
  };

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
        body: JSON.stringify({ name: newCategoryName.trim() }),
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
      setTimeout(() => (successMessage = ''), 4000); // Clear success message after 4s
    }
  }

  async function handleDeleteCategory(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    errorMessage = '';
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete category');

      categories = categories.filter((c) => c.id !== id);
    } catch (err: any) {
      errorMessage = err.message;
    }
  }

  onMount(() => {
    fetchCategories();
  });
</script>

<div class="mx-auto max-w-4xl space-y-8">
  {#if errorMessage}
    <div
      class="rounded border-l-4 border-brand-alert bg-brand-alert/10 p-4 text-brand-alert shadow-sm"
    >
      <p class="font-medium">{errorMessage}</p>
    </div>
  {/if}
  {#if successMessage}
    <div
      class="rounded border-l-4 border-brand bg-brand/10 p-4 text-brand shadow-sm"
    >
      <p class="font-medium">{successMessage}</p>
    </div>
  {/if}

  <div class="rounded-xl border border-outline bg-surface p-6 shadow-sm">
    <h2 class="mb-4 text-lg font-bold text-content">Create New Category</h2>
    <form onsubmit={handleAddCategory} class="flex items-end gap-4">
      <div class="flex-1">
        <label for="name" class="mb-1 block text-sm font-medium text-content-muted"
          >Category Name</label
        >
        <input
          type="text"
          id="name"
          bind:value={newCategoryName}
          placeholder="e.g. Desk Organization"
          class="w-full rounded-lg border border-outline bg-base px-4 py-2 text-content transition-all outline-none focus:border-brand focus:ring-2 focus:ring-brand"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !newCategoryName.trim()}
        class="rounded-lg bg-brand px-6 py-2 font-medium text-black transition-all hover:opacity-80 focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Add Category'}
      </button>
    </form>
  </div>

  <div
    class="overflow-hidden rounded-xl border border-outline bg-surface shadow-sm"
  >
    <div
      class="flex items-center justify-between border-b border-outline bg-base px-6 py-4"
    >
      <h2 class="text-lg font-bold text-content">Active Categories</h2>
      <span class="text-sm font-medium text-content-muted"
        >{categories.length} Total</span
      >
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr
            class="bg-base/50 text-sm tracking-wider text-content-muted uppercase"
          >
            <th class="px-6 py-3 font-medium">Name</th>
            <th class="px-6 py-3 font-medium">URL Slug</th>
            <th class="px-6 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-outline">
          {#if isLoading}
            <tr>
              <td colspan="3" class="px-6 py-8 text-center text-content-muted"
                >Loading categories...</td
              >
            </tr>
          {:else if categories.length === 0}
            <tr>
              <td colspan="3" class="px-6 py-8 text-center text-content-muted"
                >No categories found. Create one above.</td
              >
            </tr>
          {:else}
            {#each categories as category}
              <tr class="transition-colors hover:bg-base">
                <td class="px-6 py-4 font-medium text-content"
                  >{category.name}</td
                >
                <td class="px-6 py-4 font-mono text-sm text-content-muted"
                  >/{category.slug}</td
                >
                <td class="px-6 py-4 text-right">
                  <button
                    onclick={() =>
                      handleDeleteCategory(category.id, category.name)}
                    class="text-sm font-medium text-brand-alert transition-colors hover:opacity-80"
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
