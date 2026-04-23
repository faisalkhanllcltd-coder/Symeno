<script lang="ts">
  import InputField from '../../ui/forms/InputField.svelte';
  import SelectBox from '../../ui/forms/SelectBox.svelte';
  import ToggleSwitch from '../../ui/forms/ToggleSwitch.svelte';
  import Button from '../../ui/navigation/Button.svelte';

  let code = '';
  let type = 'percentage';
  let value = '';
  let isActive = true;
  let usageLimit = '';

  const discountTypes = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount ($)' },
    { value: 'shipping', label: 'Free Shipping' }
  ];
</script>

<form class="space-y-8" method="POST" action="/api/admin/discounts">
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    <div class="lg:col-span-2 space-y-6">
      <div class="bg-[#111318] border border-white/10 p-6 space-y-6">
        <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-3">Promotion Logic</h3>
        
        <InputField 
          id="discount_code" 
          label="Discount Code" 
          bind:value={code} 
          required={true} 
          placeholder="e.g. LAUNCH20" 
        />
        
        <div class="grid grid-cols-2 gap-6">
          <SelectBox 
            id="discount_type" 
            label="Discount Type" 
            bind:value={type} 
            options={discountTypes} 
            required={true} 
          />
          
          {#if type !== 'shipping'}
            <InputField 
              id="discount_value" 
              label="Value" 
              type="number" 
              bind:value={value} 
              required={true} 
              placeholder={type === 'percentage' ? '20' : '50.00'} 
            />
          {/if}
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="bg-[#111318] border border-white/10 p-6 space-y-6">
        <h3 class="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-white/10 pb-3">Constraints</h3>
        
        <div class="space-y-4">
          <ToggleSwitch 
            id="is_active" 
            label="Status: Active" 
            bind:checked={isActive} 
          />
        </div>

        <div class="pt-4 border-t border-white/10">
          <InputField 
            id="usage_limit" 
            label="Total Usage Limit (Optional)" 
            type="number" 
            bind:value={usageLimit} 
            placeholder="8" 
          />
          <p class="text-[9px] font-mono text-white/40 mt-2">Leave blank for unlimited uses across all customers.</p>
        </div>
      </div>
    </div>
    
  </div>

  <div class="flex justify-end gap-4 border-t border-white/10 pt-6">
    <Button variant="ghost" type="button" on:click={() => window.history.back()}>Cancel</Button>
    <Button variant="primary" type="submit">Activate Promotion</Button>
  </div>
</form>
