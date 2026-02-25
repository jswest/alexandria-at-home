<script>
  import BookCard from "$lib/components/BookCard.svelte";

  export let data;
  const { book } = data;
</script>

<div class="detail-layout">
  <div class="card-column">
    <BookCard {book} />
  </div>
  {#if book.description}
    <div class="description">
      {#each book.description.split("\n") as graf}
        <p>{graf}</p>
      {/each}
    </div>
  {/if}
</div>

<style>
  .detail-layout {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 0 var(--unit);
  }

  .card-column {
    flex-shrink: 0;
  }

  .description {
    flex: 1;
    min-width: 250px;
    max-width: 700px;
    color: white;
    font-family: var(--font-serif);
    font-size: var(--unit);
    line-height: calc(var(--unit) * 1.5);
    padding: var(--unit);
  }

  .description p {
    margin-bottom: calc(var(--unit) * 0.75);
  }
</style>
