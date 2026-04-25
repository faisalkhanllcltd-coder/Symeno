<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    type = 'button',
    variant = 'primary',
    isLoading = false,
    class: className = '',
    disabled = false,
    onclick,
    children
  }: {
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    isLoading?: boolean;
    class?: string;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  } = $props();

  // FIX: Injected min-h-[44px] and min-w-[44px] for strict WCAG/Apple touch target compliance
  const baseClass =
    'min-h-[44px] min-w-[44px] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Sharp, operations-focused styling. Fully tokenized.
  const variants = {
    primary: 'bg-brand text-brand-dark hover:opacity-80 focus:ring-brand border border-transparent',
    secondary: 'bg-surface text-content hover:bg-outline focus:ring-outline border border-outline',
    danger: 'bg-brand-alert text-white hover:opacity-80 focus:ring-brand-alert border border-transparent',
    ghost: 'bg-transparent text-content-muted hover:text-content hover:bg-surface focus:ring-outline border border-transparent',
  };
</script>

<button
  {type}
  class="{baseClass} {variants[variant]} {className}"
  disabled={isLoading || disabled}
  {onclick}
>
  {#if isLoading}
    <svg class="mr-2 -ml-1 h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {/if}
  {#if children}
    {@render children()}
  {/if}
</button>