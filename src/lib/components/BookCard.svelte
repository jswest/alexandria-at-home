<script>
  import { BookOpenCheck, Calendar, User } from "lucide-svelte";

  export let book;
  const { authors, subtitle, publishedAt, publisher, title } = book;
</script>

<div class="BookCard">
  <div class="guts">
    <div class="title sub-card">
      <h1>
        <a href="/books/{book.id}">
          <span class="title">{title}</span><span class="subtitle"
            >{subtitle ? `: ${subtitle}` : ""}</span
          >
        </a>
      </h1>
    </div>
    {#each authors as a}
      <div class="author sub-card">
        <h2 class="author-name">
          <User size="14" strokeWidth="2" />
          <a href="/authors/{a.author.id}">{a.author.name}</a>
        </h2>
        {#if a.author?.bornAt}
          <h2 class="author-born-at">
            <Calendar size="14" strokeWidth="2" />
            {a.author?.bornAt?.getFullYear()}
          </h2>
        {/if}
      </div>
    {/each}
    {#if publisher}
      <div class="publisher sub-card">
        <h2 class="publisher-name">
          <BookOpenCheck size="14" />
          <a href="publishers/{publisher.id}">{publisher.name}</a>
        </h2>
        <h2 class="published-at">
          <Calendar size="14" />
          {publishedAt?.getFullYear()}
        </h2>
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
    height: 300px;
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
</style>
