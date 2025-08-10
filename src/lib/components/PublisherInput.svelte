<script>
  import { Building } from "lucide-svelte";
  import AutocompleteInput from "$lib/components/AutocompleteInput.svelte";

  const { onSubmit } = $props();
</script>

<AutocompleteInput
  apiEndpoint="/api/publishers"
  placeholder="Add a publisher"
  name="add-publisher"
  {onSubmit}
>
  {#snippet icon()}
    <Building size={12} />
  {/snippet}
</AutocompleteInput>