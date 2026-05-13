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
          label: 'Analytics',
          path: '/admin/analytics',
          icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
        },
        {
          label: 'Orders',
          path: '/admin/orders',
          icon: 'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
        },
        {
          label: 'Returns',
          path: '/admin/returns',
          icon: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z',
        },
      ],
    },
    {
      title: 'Catalog',
      links: [
        {
          label: 'Products',
          path: '/admin/products',
          icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
        },
        {
          label: 'Inventory',
          path: '/admin/inventory',
          icon: 'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z',
        },
        {
          label: 'Categories',
          path: '/admin/categories',
          icon: 'M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z',
        },
        {
          label: 'Brands',
          path: '/admin/brands',
          icon: 'M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z',
        },
      ],
    },
    {
      title: 'Customers',
      links: [
        {
          label: 'Customer CRM',
          path: '/admin/customers',
          icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
        },
        {
          label: 'Reviews',
          path: '/admin/reviews',
          icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z',
        },
        {
          label: 'Promotions',
          path: '/admin/discounts',
          icon: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.41l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.41zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
        },
      ],
    },
    {
      title: 'System',
      links: [
        {
          label: 'Settings',
          path: '/admin/settings/store',
          icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.73 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.49-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
        },
        {
          label: 'Audit Logs',
          path: '/admin/audit-logs',
          icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
        },
      ],
    },
  ];

  // Helper to ensure parent sections stay highlighted when on deep routes
  const isPathActive = (linkPath: string, current: string) => {
    if (linkPath === '/admin') return current === '/admin';
    if (linkPath.startsWith('/admin/settings')) return current.startsWith('/admin/settings');
    return current.startsWith(linkPath);
  };
</script>

<aside class="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-outline bg-base md:flex">
  <div class="flex h-16 shrink-0 items-center border-b border-outline px-6">
    <a
      href="/admin"
      class="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm w-max"
    >
      <img src="/logo.svg" alt="Symeno" class="h-6 w-auto" />
      <span class="ml-2 font-mono text-[9px] tracking-widest text-content-muted uppercase border border-outline px-1.5 py-0.5 rounded-sm">
        OPS
      </span>
    </a>
  </div>

  <div class="no-scrollbar flex-1 space-y-8 overflow-y-auto px-4 py-6">
    {#each navGroups as group}
      <div>
        <h3 class="mb-3 px-2 font-mono text-[9px] tracking-widest text-content-muted uppercase">
          {group.title}
        </h3>
        <ul class="space-y-1">
          {#each group.links as link}
            <li>
              <a
                href={link.path}
                class="flex items-center px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm {isPathActive(link.path, currentPath) ? 'bg-brand/10 text-brand' : 'text-content-muted hover:bg-surface hover:text-content'}"
              >
                <svg class="mr-3 h-4 w-4 fill-current opacity-70" viewBox="0 0 24 24"><path d={link.icon} /></svg>
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