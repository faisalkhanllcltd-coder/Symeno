<script lang="ts">
  import InputField from '../../ui/forms/InputField.svelte';
  import Button from '../../ui/navigation/Button.svelte';
  import SelectBox from '../../ui/forms/SelectBox.svelte';

  let subject = '';
  const subjects = [
    { value: 'order', label: 'Order Inquiry' },
    { value: 'return', label: 'Return (RMA) Request' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'general', label: 'General Feedback' }
  ];
</script>

<form action="/api/support/contact" method="POST" class="space-y-6 bg-[#F9FAFB] p-8 border border-gray-200">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <InputField id="name" label="Full Name" required={true} client:load />
    <InputField id="email" label="Email Address" type="email" required={true} client:load />
  </div>
  
  <SelectBox id="subject" label="Inquiry Subject" bind:value={subject} options={subjects} required={true} client:load />
  
  <div class="flex flex-col gap-1.5">
    <label for="message" class="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Message Payload</label>
    <textarea id="message" name="message" rows="5" required class="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-none"></textarea>
  </div>

  <Button type="submit" variant="primary" client:load className="w-full py-4">Transmit Inquiry</Button>
</form>
