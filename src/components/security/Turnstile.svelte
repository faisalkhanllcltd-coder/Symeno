<script lang="ts">
  import { ui } from '../../stores/ui.svelte.ts';

  // THE FIX: Explicitly export a bindable token state
  let { sitekey = '', token = $bindable('') } = $props<{ sitekey?: string; token?: string }>();
  
  let widgetContainer: HTMLDivElement;
  let widgetId: string | undefined;

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

    renderWidget();
    
    const checkInterval = setInterval(() => {
        if (!widgetId) {
            renderWidget();
        } else {
            clearInterval(checkInterval);
        }
    }, 100);
    
    return () => {
         clearInterval(checkInterval);
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