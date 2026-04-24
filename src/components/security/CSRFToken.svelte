<script lang="ts">
  // Required for all state-mutating forms (Settings, Checkout, Login)
  export let token: string = '';
</script>

<input type="hidden" name="csrf_token" value={token} />
