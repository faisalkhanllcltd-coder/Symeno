<script lang="ts">
  // Required for all state-mutating forms (Settings, Checkout, Login)
  let { token = '' } = $props<{ token?: string }>();
</script>

<input type="hidden" name="csrf_token" value={token} />
