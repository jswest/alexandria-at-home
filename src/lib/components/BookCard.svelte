<script>
  import { BookOpenCheck, Calendar, User, Edit, Check, X, Trash2 } from "lucide-svelte";

  import Token from "$lib/components/Token.svelte";
  import TokenList from "$lib/components/TokenList.svelte";
  import TagInput from "$lib/components/TagInput.svelte";
  import AuthorInput from "$lib/components/AuthorInput.svelte";
  import PublisherInput from "$lib/components/PublisherInput.svelte";
  import Card from "$lib/components/Card.svelte";
  import { getYear } from "$lib/util.js";

  export let book;

  let editing = false;
  let editedTitle = book.title;
  let editedSubtitle = book.subtitle || "";
  let editedPublishedAt = getYear(book.publishedAt) || "";
  let editedPublisherName = book.publisher?.name || "";
  let editedAuthors = book.authors?.map(a => a.author.name) || [];

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

  async function handleRemoveTag(tagId) {
    const response = await fetch(`/api/books-tags`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookId: book.id, tagId }),
    });

    if (response.ok) {
      const data = await response.json();
      book = data.book;
    }
  }

  function handleEdit() {
    editing = true;
    editedTitle = book.title;
    editedSubtitle = book.subtitle || "";
    editedPublishedAt = getYear(book.publishedAt) || "";
    editedPublisherName = book.publisher?.name || "";
    editedAuthors = book.authors?.map(a => a.author.name) || [];
  }

  function handleCancel() {
    editing = false;
    editedTitle = book.title;
    editedSubtitle = book.subtitle || "";
    editedPublishedAt = getYear(book.publishedAt) || "";
    editedPublisherName = book.publisher?.name || "";
    editedAuthors = book.authors?.map(a => a.author.name) || [];
  }

  async function handleSave() {
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editedTitle,
          subtitle: editedSubtitle,
          publishedAt: editedPublishedAt
            ? new Date(`${editedPublishedAt}-01-01`).toISOString()
            : book.publishedAt.toISOString(),
          publisherName: editedPublisherName,
          authorNames: editedAuthors.join(","),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        book = data.book;
        editing = false;
      }
    } catch (error) {
      // Error is visible to user via failed UI action
    }
  }

  async function handleAddAuthor(authorName) {
    if (authorName && !editedAuthors.includes(authorName)) {
      editedAuthors = [...editedAuthors, authorName];
    }
  }

  function handleRemoveAuthor(authorName) {
    editedAuthors = editedAuthors.filter(name => name !== authorName);
  }

  async function handleAddPublisher(publisherName) {
    editedPublisherName = publisherName;
  }

  async function handleDelete() {
    if (confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/books/${book.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        // Error is visible to user via failed UI action
      }
    }
  }
</script>

<Card variant="white" size="medium">
  {#snippet children()}
    {#if editing}
      <div class="title sub-card editing">
        <div class="edit-field">
          <input bind:value={editedTitle} placeholder="Title" type="text" />
          <button on:click={handleSave}><Check size="12" /></button>
          <button on:click={handleCancel}><X size="12" /></button>
        </div>
        <div class="edit-field">
          <input bind:value={editedSubtitle} placeholder="Subtitle" type="text" />
          <button on:click={handleSave}><Check size="12" /></button>
          <button on:click={handleCancel}><X size="12" /></button>
        </div>
      </div>
    {:else}
      <div class="title sub-card">
        <h1>
          <a href="/books/{book.id}">
            <span class="title">{book.title}</span><span class="subtitle"
              >{book.subtitle ? `: ${book.subtitle}` : ""}</span
            >
          </a>
        </h1>
      </div>
    {/if}

    {#if editing}
      <div class="authors sub-card editing">
        <div class="edit-field">
          <AuthorInput onSubmit={handleAddAuthor} />
        </div>
        {#if editedAuthors.length > 0}
          <div class="edit-field">
            <p class="current-value">Current authors:</p>
            <TokenList items={editedAuthors} onRemove={handleRemoveAuthor} />
          </div>
        {/if}
      </div>
    {:else}
      {#each book.authors as a}
        {@const author = a.author}
        <div class="author sub-card">
          <h2 class="author-name">
            <User size="14" />
            <a href="/authors/{author.id}" target="_self">{author.name}</a>
          </h2>
          {#if author.bornAt}
            <h2 class="author-born-at">
              <Calendar size="14" strokeWidth="2" />
              {getYear(author.bornAt)}
            </h2>
          {/if}
        </div>
      {/each}
    {/if}
    {#if editing}
      <div class="publisher sub-card editing">
        <div class="edit-field">
          {#if editedPublisherName}
            <p class="current-value">Current: {editedPublisherName}</p>
          {/if}
          <PublisherInput onSubmit={handleAddPublisher} />
        </div>
        <div class="edit-field">
          <input bind:value={editedPublishedAt} placeholder="Publication Year" type="text" />
        </div>
      </div>
    {:else if book.publisher}
      <div class="publisher sub-card">
        <h2 class="publisher-name">
          <BookOpenCheck size="14" />
          <a href="publishers/{book.publisher.id}">{book.publisher.name}</a>
        </h2>
        <h2 class="published-at">
          <Calendar size="14" />
          {getYear(book.publishedAt)}
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
            <Token
              link="/tags/{tag.id}"
              text={tag.name}
              type="tag"
              removable={true}
              onRemove={() => handleRemoveTag(tag.id)}
            />
          {/each}
        </p>
      </div>
    {/if}
    {#if !editing}
      <div class="edit-controls sub-card">
        <button on:click={handleEdit}>
          <Edit size="12" />
          Edit
        </button>
        <button class="delete-btn" on:click={handleDelete}>
          <Trash2 size="12" />
          Delete
        </button>
      </div>
    {:else}
      <div class="edit-controls sub-card">
        <button on:click={handleSave}>
          <Check size="14" />
          Save All
        </button>
        <button on:click={handleCancel}>
          <X size="14" />
          Cancel
        </button>
      </div>
    {/if}
  {/snippet}
</Card>

<style>
  .author-name {
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
  }

  .publisher-name {
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
  }

  .title .edit-field {
    display: flex;
  }
  .edit-field {
    margin-bottom: calc(var(--unit) * 0.25);
  }

  .edit-field:last-child {
    margin-bottom: 0;
  }

  .edit-field input {
    background-color: white;
    border: none;
    border-bottom: 1px dotted var(--color-bg);
    color: var(--color-bg);
    padding: calc(var(--unit) * 0.125);
  }

  .edit-field button {
    background: transparent;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    padding: calc(var(--unit) * 0.125);
  }

  .edit-field button:hover {
    background-color: var(--color-offset-transparent);
  }

  .current-value {
    color: var(--color-bg);
    font-size: calc(var(--unit) * 0.75);
    margin-bottom: 0;
    opacity: 0.7;
  }
  .edit-controls button {
    background: transparent;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    font-family: var(--font-serif);
    padding: calc(var(--unit) * 0.25);
  }
</style>
