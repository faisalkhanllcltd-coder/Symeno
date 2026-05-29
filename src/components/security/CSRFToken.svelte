<!--
  DEAD CODE — This component is not used anywhere.
  The CSRF injection system in Storefront.astro has been removed.
  Safe to delete this file. Kept for reference only.
-->
<script lang="ts">
  // Required for all state-mutating forms (Settings, Checkout, Login)
  let { token = '' } = $props<{ token?: string }>();
</script>

<input type="hidden" name="csrf_token" value={token} />
