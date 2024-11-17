<script>
  import { Tag } from "lucide-svelte";

  export let link;
  export let text;
  export let type;
</script>

<span class="Token">
  {#if type === 'tag'}
    <Tag size="12" />
  {/if}
  {#if link}
    <a href="{link}">{text}</a>
  {:else}
    {text}
  {/if}
</span>

<style>
  .Token {
    background-color: var(--color-bg);
    border-radius: calc(var(--unit) * 0.5);
    color: var(--color-offset);
    display: inline-block;
    font-size: calc(var(--unit) * 0.75);
    line-height: var(--unit);
    margin-bottom: calc(var(--unit) * 0.25);
    margin-right: calc(var(--unit) * 0.25);
    padding: calc(var(--unit) * 0.125);
  }
</style>