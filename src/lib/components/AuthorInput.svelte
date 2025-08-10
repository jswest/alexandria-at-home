<script>
  import { User } from "lucide-svelte";
  import AutocompleteInput from "$lib/components/AutocompleteInput.svelte";

  const { onSubmit } = $props();
</script>

<AutocompleteInput
  apiEndpoint="/api/authors"
  placeholder="Add an author"
  name="add-author"
  {onSubmit}
>
  {#snippet icon()}
    <User size={12} />
  {/snippet}
</AutocompleteInput>