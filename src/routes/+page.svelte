<script>
  import { Scan, Search } from "lucide-svelte";

  import BookCard from "$lib/components/BookCard.svelte";
  import Card from "$lib/components/Card.svelte";
  import CreateBook from "$lib/components/CreateBook.svelte";
  import { sleep } from "$lib/util.js";

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
          for (const a of b.book.authors) {
            a.author.bornAt = new Date(a.author.bornAt);
          }
          b.book.publishedAt = new Date(b.book.publishedAt);
        }
      }
      books = null;
      await sleep(10);
      books = data.authors.reduce((a, c) => a.concat(c.books.map((b) => b.book)), []);
      console.log(books)
    } else {
      books = null;
    }
  }

  async function handleTitleQuery() {
    if (titleQuery.length >= 3) {
      const res = await fetch(`/api/books?titleQuery=${titleQuery}`);
      const data = await res.json();
      for (const book of data.books) {
        book.publishedAt = new Date(book.publishedAt);
        for (const a of book.authors) {
          a.author.bornAt = new Date(a.author.bornAt);
        }
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
  {/if}
</div>

<style>
  .Page h2 {
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
