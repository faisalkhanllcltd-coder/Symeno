<script lang="ts">
  // HARDENING: Allow environment variable injection for production
  // Fallback to testing key only if the environment variable is missing
  let { 
    sitekey = import.meta.env.PUBLIC_TURNSTILE_SITEKEY || '1x00000000000000000000AA' 
  } = $props<{ sitekey?: string }>();
</script>

<div class="my-4">
  <div 
    class="cf-turnstile" 
    data-sitekey={sitekey} 
    data-theme="dark"
  ></div>
</div>

<svelte:head>
  <script
    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
    async
    defer
  ></script>
</svelte:head>