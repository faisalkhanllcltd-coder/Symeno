<script lang="ts">
  import { onMount } from 'svelte';

  let showBanner = $state(false);

  onMount(() => {
    // Check if the user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      showBanner = true;
    }
  });

  function handleConsent(accepted: boolean) {
    const status = accepted ? 'accepted' : 'rejected';
    
    // Store in LocalStorage for client-side JS checks
    localStorage.setItem('cookie_consent', status);
    
    // Store as a secure cookie for edge-worker checks
    document.cookie = `cookie_consent=${status}; max-age=31536000; path=/; SameSite=Strict`;
    
    // If accepted, we can initialize analytics here if needed
    if (accepted) {
      window.dispatchEvent(new Event('consent_granted'));
    }

    showBanner = false;
  }
</script>

{#if showBanner}
  <div class="fixed bottom-0 left-0 right-0 z-50 border-t border-outline/50 bg-surface/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8 transition-transform duration-500 transform translate-y-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
    <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
      
      <div class="flex-1">
        <h3 class="font-mono text-sm font-bold tracking-widest text-content uppercase mb-1">
          Your Privacy Matters
        </h3>
        <p class="text-xs text-content-muted leading-relaxed max-w-3xl">
          We use strictly necessary cookies to keep your checkout secure and your session active. With your permission, we also use optional analytics cookies to understand how our site is used so we can improve your shopping experience. You can learn more in our <a href="/policies/cookies" class="text-brand hover:underline font-bold">Cookie Policy</a>.
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-3 w-full md:w-auto">
        <button 
          onclick={() => handleConsent(false)}
          class="flex-1 md:flex-none border border-outline/60 bg-transparent px-5 py-2.5 font-mono text-[10px] font-bold tracking-widest text-content uppercase transition-colors hover:bg-surface-hover hover:border-outline focus:outline-none rounded-sm"
        >
          Reject Non-Essential
        </button>
        <button 
          onclick={() => handleConsent(true)}
          class="flex-1 md:flex-none bg-brand px-5 py-2.5 font-mono text-[10px] font-bold tracking-widest text-brand-dark uppercase transition-colors hover:opacity-90 focus:outline-none rounded-sm"
        >
          Accept All
        </button>
      </div>

    </div>
  </div>
{/if}