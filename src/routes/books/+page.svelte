<script>
  import BookCard from "$lib/components/BookCard.svelte";

  export let data;
  const { books } = data;
</script>

<div class="Page">
  {#each books as book}
    <BookCard {book} />
  {/each}
</div>

