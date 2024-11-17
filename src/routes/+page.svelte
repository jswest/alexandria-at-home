<script>
  import { Scan, Search } from "lucide-svelte";

  import BookCard from "$lib/components/BookCard.svelte";
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
  <header class="faux-card">
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
  </header>
  <CreateBook />
  {#if books}
    {#each books as book}
      <BookCard {book} />
    {/each}
  {/if}
</div>

<style>
  .faux-card {
    background-color: var(--color-bg);
    border: 1px solid var(--color-offset);
    border-top: 5px solid var(--color-offset);
    box-sizing: border-box;
    float: left;
    height: 400px;
    margin: var(--unit);
    max-width: 300px;
    overflow: scroll;
    padding: var(--unit);
    text-align: left;
    width: 100%;
  }
  .faux-card .sub-card {
    border-left: 1px solid var(--color-offset);
  }
  .faux-card h1 {
    color: var(--color-offset);
    font-size: calc(var(--unit) * 1.75);
    line-height: 1;
    transform: scaleX(0.7);
    transform-origin: 0 50%;
    width: calc(100% * 1.4285714286);
  }
  .faux-card h1 .lighter {
    font-weight: 100;
  }
  .faux-card h2 {
    color: var(--color-offset);
    line-height: 1;
    margin-bottom: 0;
  }
  .faux-form {
    color: var(--color-offset);
  }
</style>
