<script>
  import { goto } from '$app/navigation';

  import { Save } from "lucide-svelte";
  import AuthorInput from "$lib/components/AuthorInput.svelte";
  import PublisherInput from "$lib/components/PublisherInput.svelte";
  import Card from "$lib/components/Card.svelte";

  let authorNames = [];
  let isbn = "";
  let publishedAt = "";
  let publisherName = "";
  let subtitle = "";
  let title = "";

  function handleAddAuthor(authorName) {
    if (authorName && !authorNames.includes(authorName)) {
      authorNames = [...authorNames, authorName];
    }
  }

  function handleRemoveAuthor(authorName) {
    authorNames = authorNames.filter(name => name !== authorName);
  }

  function handleAddPublisher(publisherNameValue) {
    publisherName = publisherNameValue;
  }
  async function handleSave() {
    try {
      const response = await fetch(`/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorNames: authorNames.join(","),
          isbn,
          publishedAt,
          publisherName,
          subtitle,
          title,
        }),
      });
      if (response.ok) {
        const { book } = await response.json();
        goto(`/books/${book.id}`)
      }
    } catch (error) {
      console.error(error);
    }
  }
</script>

<Card variant="white">
  {#snippet children()}
    <header class="sub-card">
      <h1>Create a book.</h1>
    </header>
    <div class="sub-card">
      <input bind:value={title} placeholder="Title" type="text" />
      <input bind:value={subtitle} placeholder="Subtitle" type="text" />
      <input bind:value={isbn} placeholder="ISBN" type="text" />
    </div>
    <div class="sub-card">
      <AuthorInput onSubmit={handleAddAuthor} />
      {#if authorNames.length > 0}
        <div class="author-list">
          {#each authorNames as authorName}
            <span class="author-tag">
              {authorName}
              <button class="remove-btn" on:click={() => handleRemoveAuthor(authorName)}>×</button>
            </span>
          {/each}
        </div>
      {/if}
    </div>
    <div class="sub-card">
      <input
        bind:value={publishedAt}
        placeholder="Publication year"
        type="text"
      />
      <PublisherInput onSubmit={handleAddPublisher} />
      {#if publisherName}
        <div class="publisher-display">
          Publisher: {publisherName}
          <button class="remove-btn" on:click={() => publisherName = ""}>×</button>
        </div>
      {/if}
    </div>
    <footer class="sub-card">
      <Save size="12" />
      <button on:click={handleSave}> Save </button>
    </footer>
  {/snippet}
</Card>

<style>
  button {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--color-offset);
    color: var(--color-offset);
    font-family: "Cormorant Garamond";
    font-size: var(--unit);
    outline: none;
  }
  footer {
    color: var(--color-offset);
  }
  .author-list {
    margin-top: calc(var(--unit) * 0.5);
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--unit) * 0.25);
  }
  
  .author-tag {
    background-color: var(--color-offset-transparent);
    border: 1px solid var(--color-offset);
    color: var(--color-bg);
    display: inline-flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.75);
    padding: calc(var(--unit) * 0.125) calc(var(--unit) * 0.25);
  }
  
  .publisher-display {
    margin-top: calc(var(--unit) * 0.5);
    color: var(--color-offset);
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.85);
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font-size: calc(var(--unit) * 0.75);
    padding: 0;
    opacity: 0.7;
  }
  
  .remove-btn:hover {
    opacity: 1;
  }
  header.sub-card h1 {
    color: var(--color-bg);
  }
</style>
