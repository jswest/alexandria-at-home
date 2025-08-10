<script>
  import BookCard from "$lib/components/BookCard.svelte";
  import Card from "$lib/components/Card.svelte";

  export let data;
  const { book } = data;
</script>

<div class="Page">
  <BookCard {book} />
  {#if book.description}
    <Card variant="white">
      <div class="sub-card">
        <h2>Description</h2>
        {#each book.description.split("\n") as graf}
          <p>{graf}</p>
        {/each}
      </div>
    </Card>
  {/if}
  <Card variant="white">
    <figure>
      <img src={book.thumbnailUrl} alt={book.title} />
    </figure>
  </Card>
</div>

<style>
  figure {
    box-sizing: border-box;
    display: block;
    margin: var(--unit) auto;
    padding: 0 calc(var(--unit) * 2);
    width: 100%;
  }
  figure img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
</style>
