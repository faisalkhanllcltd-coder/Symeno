<script lang="ts">
  // Cloudflare's invisible challenge to block bot checkout/registration attempts
  // Using the dummy testing key for local development
  let { sitekey = '1x00000000000000000000AA' } = $props<{ sitekey?: string }>();
</script>

<div class="my-4">
  <div class="cf-turnstile" data-sitekey={sitekey} data-theme="dark"></div>
</div>

<svelte:head>
  <script
    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
    async
    defer
  ></script>
</svelte:head>
