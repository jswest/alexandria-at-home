<script>
  import { Scan, Search } from "lucide-svelte";

  import BookCard from "$lib/components/BookCard.svelte";
  import Card from "$lib/components/Card.svelte";
  import CreateBook from "$lib/components/CreateBook.svelte";
  import { sleep, hydrateBookDates } from "$lib/util.js";

  let { data } = $props();
  let recentBooks = $derived(data.recentBooks.map((b) => { hydrateBookDates(b); return b; }));

  let books;

  // svelte-ignore non_reactive_update
  let nameQuery = "";
  let titleQuery = "";

  async function handleNameQuery() {
    if (nameQuery.length >= 3) {
      const res = await fetch(`/api/authors?nameQuery=${nameQuery}`);
      const data = await res.json();
      for (const author of data.authors) {
        for (const b of author.books) {
          hydrateBookDates(b.book);
        }
      }
      books = null;
      await sleep(10);
      books = data.authors.reduce((a, c) => a.concat(c.books.map((b) => b.book)), []);
    } else {
      books = null;
    }
  }

  async function handleTitleQuery() {
    if (titleQuery.length >= 3) {
      const res = await fetch(`/api/books?titleQuery=${titleQuery}`);
      const data = await res.json();
      for (const book of data.books) {
        hydrateBookDates(book);
      }
      books = [...data.books];
    } else {
      books = null;
    }
  }
</script>

<div class="Page">
  <Card variant="dark">
    <div class="sub-card">
      <h1 class="title">
        Alexandria at Home. <span class="lighter"
          >A library for the Beebe-West household.</span
        >
      </h1>
    </div>
    <div class="sub-card">
      <h2>
        <Scan size="12" />
        <a href="/scan">Scan a new book.</a>
      </h2>
    </div>
    <div class="sub-card">
      <div class="faux-form">
        <Search size="12" />
        <input
          bind:value={titleQuery}
          onkeyup={handleTitleQuery}
          type="text"
          placeholder="Search by title"
        />
      </div>
      <div class="faux-form">
        <Search size="12" />
        <input
          bind:value={nameQuery}
          onkeyup={handleNameQuery}
          type="text"
          placeholder="Search by author"
        />
      </div>
    </div>
  </Card>
  <CreateBook />
  {#if books}
    {#each books as book}
      <BookCard {book} />
    {/each}
  {:else if recentBooks.length > 0}
    {#each recentBooks as book}
      <BookCard {book} />
    {/each}
  {/if}
</div>

<style>
  .Page h2,
  .Page .section-label {
    color: var(--color-offset);
  }
  .Page .faux-form {
    color: var(--color-offset);
  }
  .Page input {
    background-color: transparent;
    color: var(--color-offset);
  }
</style>
