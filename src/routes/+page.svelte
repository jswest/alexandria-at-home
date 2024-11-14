<script>
  import BookCard from "$lib/components/BookCard.svelte";
  let { data } = $props();
</script>

<div class="Page">
  <header>
    <h1 class="title">Alexandria at Home.</h1>
    <p>A library for the Beebe-West household.</p>
  </header>

  {#each data.books as book}
    <BookCard {book} />
  {/each}
</div>

<style>
  header {
    background-color: #858585;
    color: white;
    padding: var(--unit);
    text-align: left;
  }
  header h1 {
    font-size: calc(var(--unit) * 6);
    line-height: 1;
    transform: scaleX(0.7);
    transform-origin: 0 50%;
  }
  header p { 
    font-size: calc(var(--unit) * 2);
    font-weight: 100;
  }
</style>
