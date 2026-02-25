<script>
  const { items = [], onRemove } = $props();
</script>

{#if items.length > 0}
  <div class="token-list">
    {#each items as item}
      <span class="token-item">
        {item}
        {#if onRemove}
          <button class="remove-btn" onclick={() => onRemove(item)} type="button">&times;</button>
        {/if}
      </span>
    {/each}
  </div>
{/if}

<style>
  .token-list {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--unit) * 0.25);
    margin-top: calc(var(--unit) * 0.25);
  }

  .token-item {
    background-color: var(--color-offset-transparent);
    border: 1px solid var(--color-offset);
    color: var(--color-bg);
    display: inline-flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.75);
    padding: calc(var(--unit) * 0.125) calc(var(--unit) * 0.25);
  }

  .remove-btn {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: calc(var(--unit) * 0.75);
    padding: 0;
    opacity: 0.7;
  }

  .remove-btn:hover {
    opacity: 1;
  }
</style>
