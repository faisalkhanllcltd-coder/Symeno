<script lang="ts">
  let { name = '' } = $props<{ name: string }>();
  
  let greeting = $state('Welcome back');

  $effect(() => {
    const hour = new Date().getHours();
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
  });
</script>

<h1 class="text-2xl font-bold text-white mb-1">
  {greeting}, <span class="text-[#36f4a4]">{name || 'Operator'}</span>
</h1>