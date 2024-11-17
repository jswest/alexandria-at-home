<script>
  import { BookOpenCheck, Calendar, Check, Edit, User, X } from "lucide-svelte";

  import Token from "$lib/components/Token.svelte";

  export let data;
  const { book } = data;

  let editing = false;
  let editedPublishedAt = book.publishedAt?.getFullYear() || "";
  let editedPublisherName = book.publisher?.name || "";
  let editedSubtitle = book.subtitle;
  let editedTitle = book.title;

  function handleCancel() {
    editedPublishedAt = book.publishedAt?.getFullYear() || "";
    editedPublisherName = book.publisher?.name || "";
    editedSubtitle = book.subtitle;
    editedTitle = book.title;
    editing = false;
  }

  async function handleSave() {
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publishedAt: editedPublishedAt
            ? new Date(`${editedPublishedAt}-02-01`).toISOString()
            : book.publishedAt.toISOString(),
          publisherName: editedPublisherName,
          subtitle: editedSubtitle,
          title: editedTitle,
        }),
      });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="Page">
  <figure>
    <img src={book.thumbnailUrl} alt={book.title} />
  </figure>
  <div class="Book">
    {#if editing}
      <header class="sub-card">
        <input bind:value={editedTitle} type="text" />
        <button on:click={handleSave}>
          <Check size="12" />
        </button>
        <button on:click={handleCancel}>
          <X size="12" />
        </button>
        <input bind:value={editedSubtitle} type="text" />
        <button on:click={handleSave}>
          <Check size="12" />
        </button>
        <button on:click={handleCancel}>
          <X size="12" />
        </button>
      </header>
    {:else}
      <header class="sub-card">
        <h1>
          {book.title}<span class="lighter"
            >{book.subtitle ? `: ${book.subtitle}` : ""}</span
          >
        </h1>
      </header>
    {/if}
    {#each book.authors as a}
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
    {#if editing}
      <div class="publisher sub-card">
        <div class="sub-card">
          <div class="field">
            <input
              bind:value={editedPublisherName}
              placeholder="publisher name"
              type="text"
            />
            <button on:click={handleSave}>
              <Check size="12" />
            </button>
            <button on:click={handleCancel}>
              <X size="12" />
            </button>
          </div>
          <div class="field">
            <input bind:value={editedPublishedAt} type="text" />
            <button on:click={handleSave}>
              <Check size="12" />
            </button>
            <button on:click={handleCancel}>
              <X size="12" />
            </button>
          </div>
        </div>
      </div>
    {:else if book.publisher}
      <div class="publisher sub-card">
        <h2 class="publisher-name">
          <BookOpenCheck size="14" />
          {book.publisher.name}
        </h2>
        <h2 class="published-at">
          <Calendar size="14" />
          {book.publishedAt?.getFullYear()}
        </h2>
      </div>
    {/if}
    {#if !editing}
      <div class="sub-card">
        <button on:click={() => (editing = true)}>
          <Edit size="12" />
          Edit book.
        </button>
      </div>
    {/if}
    {#if book.description}
      <div class="description sub-card">
        {#each book.description.split("\n") as graf}
          <p>{graf}</p>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  figure {
    float: left;
    margin: 0 var(--unit);
    padding: 0;
  }
  figure img {
    margin: 0;
  }
  .Book {
    background-color: #ececec;
    border-top: 5px solid var(--color-offset);
    box-sizing: border-box;
    height: 100vh;
    margin: var(--unit);
    max-height: 600px;
    max-width: 600px;
    overflow: scroll;
    padding: var(--unit);
    width: 100%;
  }
  h1,
  h2 {
    line-height: 1;
    margin-bottom: 0;
  }
  h1 {
    font-size: calc(var(--unit) * 1.75);
    line-height: 1;
    transform: scaleX(0.7);
    transform-origin: 0% 50%;
    width: calc(100% * 1.4285714286);
  }
  h2:hover a {
    text-decoration: underline;
  }
  h1 .lighter {
    font-weight: 100;
  }
  .description p:last-child {
    margin-bottom: 0;
  }
  button {
    background-color: transparent;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    font-family: "Cormorant Garamond";
    font-size: var(--unit);
    line-height: 1;
    margin: 0;
    outline: none;
  }
  input {
    background-color: transparent;
    color: var(--color-bg);
    width: calc(100% - 40px);
  }
</style>
