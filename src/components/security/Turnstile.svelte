<script lang="ts">
  import { ui } from '../../stores/ui.svelte.ts';

  // THE FIX: Explicitly export a bindable token state
  let { sitekey = '', token = $bindable('') } = $props<{ sitekey?: string; token?: string }>();

  let widgetContainer: HTMLDivElement;
  let widgetId: string | undefined;

  // Exported so parent components can reset this specific widget by ID
  export function resetWidget() {
    if ((window as any).turnstile && widgetId) {
      (window as any).turnstile.reset(widgetId);
      token = '';
    }
  }

  $effect(() => {
    if (typeof window === 'undefined') return;

    const actualSiteKey = sitekey || import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || (window as any).PUBLIC_TURNSTILE_SITE_KEY;

    const renderWidget = () => {
      if ((window as any).turnstile && widgetContainer && actualSiteKey && !widgetId) {
        widgetId = (window as any).turnstile.render(widgetContainer, {
          sitekey: actualSiteKey,
          theme: ui.theme || 'dark',
          appearance: 'always',
          // THE FIX: Bind Cloudflare's callbacks directly to Svelte state
          callback: (res: string) => { token = res; },
          'expired-callback': () => { token = ''; },
          'error-callback': () => { token = ''; }
        });
      }
    };

    // If Turnstile library already loaded, render immediately.
    // Otherwise wait for the 'turnstileLoaded' event dispatched by Storefront.astro.
    if ((window as any).turnstile) {
      renderWidget();
    } else {
      window.addEventListener('turnstileLoaded', renderWidget);
    }

    return () => {
      window.removeEventListener('turnstileLoaded', renderWidget);
      if (widgetId && (window as any).turnstile) {
        (window as any).turnstile.remove(widgetId);
        widgetId = undefined;
      }
    };
  });
</script>

<div class="my-4 flex justify-center w-full min-h-[65px]">
  <div bind:this={widgetContainer}></div>
</div>