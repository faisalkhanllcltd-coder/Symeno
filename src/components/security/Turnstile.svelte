<script lang="ts">
  import { ui } from '../../stores/ui.svelte.ts';

  let { sitekey = '' } = $props<{ sitekey?: string }>();
  
  let widgetContainer: HTMLDivElement;
  let widgetId: string | undefined;

  $effect(() => {
    if (typeof window === 'undefined') return;

    // Grab the key from props or fallback to Vite env or the global variable
    const actualSiteKey = sitekey || import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || (window as any).PUBLIC_TURNSTILE_SITE_KEY;
    
    // The core rendering function
    const renderWidget = () => {
        if ((window as any).turnstile && widgetContainer && actualSiteKey && !widgetId) {
            widgetId = (window as any).turnstile.render(widgetContainer, {
                sitekey: actualSiteKey,
                theme: ui.theme || 'dark',
                appearance: 'always'
            });
        }
    };

    // 1. Try to render immediately
    renderWidget();
    
    // 2. Poll for Cloudflare every 100ms to beat the race condition
    const checkInterval = setInterval(() => {
        if (!widgetId) {
            renderWidget();
        } else {
            clearInterval(checkInterval);
        }
    }, 100);
    
    // 3. Cleanup function when component unmounts
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