<script lang="ts">
  let { name = '' } = $props<{ name?: string }>();

  let greeting = $state('Welcome back');

  $effect(() => {
    const hour = new Date().getHours();
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';    
    else greeting = 'Good evening';
  });
</script>

<h1 class="mb-1 text-2xl font-bold text-content">
  {greeting}, <span class="text-brand">{name || 'Operator'}</span>
</h1>
