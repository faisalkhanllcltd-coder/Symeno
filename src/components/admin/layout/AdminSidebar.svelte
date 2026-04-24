<script lang="ts">
  let { currentPath = '' } = $props<{ currentPath?: string }>();

  const navGroups = [
    {
      title: 'Operations',
      links: [
        {
          label: 'Overview',
          path: '/admin',
          icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
        },
        {
          label: 'Fulfillment Queue',
          path: '/admin/orders',
          icon: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
        },
      ],
    },
    {
      title: 'Commerce',
      links: [
        {
          label: 'Inventory Matrix',
          path: '/admin/products',
          icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        },
        {
          label: 'Customer CRM',
          path: '/admin/customers',
          icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
        },
        {
          label: 'Promotions',
          path: '/admin/discounts',
          icon: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
        },
      ],
    },
  ];
</script>

<aside
  class="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-outline bg-base md:flex"     
>
  <div class="flex h-16 shrink-0 items-center border-b border-outline px-6">
    <a
      href="/admin"
      class="text-xl font-bold tracking-tighter text-content uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm w-max"
      >Symeno<span class="text-brand">.</span><span 
        class="ml-2 font-mono text-[10px] text-content-muted">OPS</span
      ></a
    >
  </div>

  <div class="no-scrollbar flex-1 space-y-8 overflow-y-auto px-4 py-6">
    {#each navGroups as group}
      <div>
        <h3
          class="mb-3 px-2 font-mono text-[9px] tracking-widest text-content-muted uppercase"
        >
          {group.title}
        </h3>
        <ul class="space-y-1">
          {#each group.links as link}
            <li>
              <a
                href={link.path}
                class="flex items-center px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {currentPath ===        
                  link.path ||
                (link.path !== '/admin' && currentPath.startsWith(link.path))
                  ? 'bg-brand/10 text-brand'   
                  : 'text-content-muted hover:bg-surface hover:text-content'}"
              >
                <svg
                  class="mr-3 h-4 w-4 fill-current opacity-70"
                  viewBox="0 0 24 24"><path d={link.icon} /></svg
                >
                {link.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>

  <div class="shrink-0 border-t border-outline p-4">   
    <a
      href="/"
      class="flex items-center px-2 py-2 font-mono text-[10px] tracking-widest text-content-muted uppercase transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
    >
      &larr; Exit to Storefront
    </a>
  </div>
</aside>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>