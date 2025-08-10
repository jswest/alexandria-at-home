<script>
  import { Tag, X } from "lucide-svelte";

  export let link;
  export let text;
  export let type;
  export let removable = false;
  export let onRemove = () => {};
</script>

<span class="Token">
  {#if type === "tag"}
    <span class="icon-wrapper">
      <Tag size="12" />
    </span>
  {/if}
  {#if link}
    <a href={link}>{text}</a>
  {:else}
    {text}
  {/if}
  {#if removable}
    <button class="remove-btn" on:click={onRemove} type="button">
      <X size="12" />
    </button>
  {/if}
</span>

<style>
  .Token {
    background-color: var(--color-offset-transparent);
    border: 1px solid var(--color-offset);
    color: var(--color-bg);
    display: inline-block;
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.75);
    font-weight: 400;
    line-height: calc(var(--unit) * 1);
    margin-bottom: calc(var(--unit) * 0.25);
    margin-right: calc(var(--unit) * 0.5);
    padding: 0 calc(var(--unit) * 0.25);
  }
  .Token .icon-wrapper {
    position: relative;
    top: 3px;
  }
  .remove-btn {
    background: none;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    margin-left: calc(var(--unit) * 0.25);
    padding: 0;
    opacity: 0.7;
    position: relative;
    top: 2px;
  }
  .remove-btn:hover {
    opacity: 1;
    color: var(--color-offset);
  }
</style>
