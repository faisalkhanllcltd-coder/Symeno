<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  export let isLoading: boolean = false;
  export let className: string = '';
  export let disabled: boolean = false;
  
  const baseClass = "px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Sharp, operations-focused styling. No rounded corners.
  const variants = {
    primary: "bg-[#10b981] text-black hover:bg-[#059669] focus:ring-[#10b981] border border-transparent",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400 border border-gray-200",
    danger: "bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 border border-transparent",
    ghost: "bg-transparent text-gray-600 hover:text-black hover:bg-gray-50 focus:ring-gray-300 border border-transparent"
  };
</script>

<button {type} class="{baseClass} {variants[variant]} {className}" disabled={isLoading || disabled} on:click>
  {#if isLoading}
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  {/if}
  <slot />
</button>
