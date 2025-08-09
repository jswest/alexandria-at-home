<script>
  import { BookOpenCheck, Calendar, User } from "lucide-svelte";

  import Token from "$lib/components/Token.svelte";
  import TagInput from "$lib/components/TagInput.svelte";

  export let book;

  async function handleTag(tagName) {
    const response = await fetch(`/api/books-tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId: book.id, tagName }),
    });

    if (response.ok) {
      const data = await response.json();
      book = data.book;
    }
  }
</script>

<div class="BookCard">
  <div class="guts">
    <div class="title sub-card">
      <h1>
        <a href="/books/{book.id}">
          <span class="title">{book.title}</span><span class="subtitle"
            >{book.subtitle ? `: ${book.subtitle}` : ""}</span
          >
        </a>
      </h1>
    </div>
    {#each book.authors as a}
      {@const author = a.author}
      <div class="author sub-card">
        <h2 class="author-name">
          <User size="14" />
          <a href="/authors/{author.id}">{author.name}</a>
        </h2>
        {#if author.bornAt}
          <h2 class="author-born-at">
            <Calendar size="14" strokeWidth="2" />
            {author.bornAt instanceof Date
              ? author.bornAt?.getFullYear()
              : author.bornAt?.split("-")[0]}
          </h2>
        {/if}
      </div>
    {/each}
    {#if book.publisher}
      <div class="publisher sub-card">
        <h2 class="publisher-name">
          <BookOpenCheck size="14" />
          <a href="publishers/{book.publisher.id}">{book.publisher.name}</a>
        </h2>
        <h2 class="published-at">
          <Calendar size="14" />
          {book.publishedAt instanceof Date
            ? book.publishedAt?.getFullYear()
            : book.publishedAt?.split("-")[0]}
        </h2>
      </div>
    {/if}
    <div class="add-tags sub-card">
      <TagInput onSubmit={handleTag} />
    </div>
    {#if book.tags?.length > 0}
      <div class="tags sub-card">
        <p>
          {#each book.tags as t}
            {@const tag = t.tag}
            <Token link="/tags/{tag.id}" text={tag.name} type="tag" />
          {/each}
        </p>
      </div>
    {/if}
  </div>
</div>

<style>
  .BookCard {
    background-color: #ececec;
    border-top: 5px solid var(--color-offset);
    box-sizing: border-box;
    float: left;
    height: 400px;
    margin: var(--unit);
    overflow: scroll;
    max-width: 300px;
    width: 100%;
  }
  .guts {
    padding: var(--unit);
  }
  h1 {
    font-size: calc(var(--unit) * 1.75);
    line-height: 1;
    transform: scaleX(0.7);
    transform-origin: 0% 50%;
    width: calc(100% * 1.4285714286);
  }
  h1:hover a,
  h2:hover a {
    text-decoration: underline;
  }
  .title {
    font-weight: 800;
  }
  .subtitle {
    font-weight: 100;
  }
  h2 {
    line-height: 1;
    margin-bottom: 0;
  }
  .author-born-at {
    font-weight: 400;
  }
  .published-at {
    font-weight: 400;
  }
  p {
    margin-bottom: 0;
  }
</style>
