<script>
  import { Check, Filter, X } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import BookCard from "$lib/components/BookCard.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import AuthorInput from "$lib/components/AuthorInput.svelte";
  import PublisherInput from "$lib/components/PublisherInput.svelte";

  export let data;

  $: ({ books, pagination, filters } = data);
  $: titleFilter = filters.title || "";
  $: authorFilter = filters.author || "";
  $: publisherFilter = filters.publisher || "";
  $: yearFrom = filters.yearFrom || "";
  $: yearTo = filters.yearTo || "";

  function applyFilters() {
    const params = new URLSearchParams();

    if (titleFilter.trim()) params.set("title", titleFilter.trim());
    if (authorFilter.trim()) params.set("author", authorFilter.trim());
    if (publisherFilter.trim()) params.set("publisher", publisherFilter.trim());
    if (yearFrom && String(yearFrom).trim())
      params.set("yearFrom", String(yearFrom).trim());
    if (yearTo && String(yearTo).trim())
      params.set("yearTo", String(yearTo).trim());

    // Reset to page 1 when applying filters
    params.set("page", "1");

    goto(`?${params.toString()}`);
  }

  function clearFilters() {
    titleFilter = "";
    authorFilter = "";
    publisherFilter = "";
    yearFrom = "";
    yearTo = "";
    goto("/books");
  }

  function handleAuthorSelect(authorName) {
    authorFilter = authorName;
    applyFilters(); // Automatically apply filters when selection is made
  }

  function handlePublisherSelect(publisherName) {
    publisherFilter = publisherName;
    applyFilters(); // Automatically apply filters when selection is made
  }
</script>

<div class="Page">
  <Card variant="white" size="medium">
    {#snippet children()}
      <div class="sub-card">
        <h2>
          <Filter size="16" />
          Filters
        </h2>
      </div>
      <div class="sub-card filters">
        <div class="filter-field">
          <label for="title">Title/subtitle</label>
          <input
            id="title"
            bind:value={titleFilter}
            placeholder="Search in title or subtitle"
            type="text"
            on:keydown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
      </div>
      <div class="sub-card filters">
        <div class="filter-field">
          <label for="author">Author</label>
          <AuthorInput onSubmit={handleAuthorSelect} />
          {#if authorFilter}
            <div class="current-filter">
              Current: {authorFilter}
              <button class="clear-field-btn" on:click={() => authorFilter = ""}>×</button>
            </div>
          {/if}
        </div>
      </div>
      <div class="sub-card filters">
        <div class="filter-field">
          <label for="publisher">Publisher</label>
          <PublisherInput onSubmit={handlePublisherSelect} />
          {#if publisherFilter}
            <div class="current-filter">
              Current: {publisherFilter}
              <button class="clear-field-btn" on:click={() => publisherFilter = ""}>×</button>
            </div>
          {/if}
        </div>
      </div>
      <div class="sub-card filters">
        <div class="filter-field">
          <label for="yearFrom">Published from</label>
          <input
            id="yearFrom"
            bind:value={yearFrom}
            placeholder="1800"
            type="number"
            min="1000"
            max="2100"
            on:keydown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
      </div>
      <div class="sub-card filters">
        <div class="filter-field">
          <label for="yearTo">Published to</label>
          <input
            id="yearTo"
            bind:value={yearTo}
            placeholder="2024"
            type="number"
            min="1000"
            max="2100"
            on:keydown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
      </div>
      <div class="sub-card filter-actions">
        <button on:click={applyFilters}>
          <Check size={12} />
          Apply filters
        </button>
        <button on:click={clearFilters}>
          <X size={12} />
          Clear
        </button>
      </div>
    {/snippet}
  </Card>
  <Pagination
    {pagination}
    itemType="books"
    currentCount={books.length}
    size={"medium"}
    totalCount={pagination.totalBooks}
    hasFilters={filters.title ||
      filters.author ||
      filters.publisher ||
      filters.yearFrom ||
      filters.yearTo}
  />
  <div class="books-grid">
    {#each books as book}
      <BookCard {book} />
    {/each}
  </div>
  {#if books.length === 0}
    <Card variant="white">
      {#snippet children()}
        <div class="sub-card no-results">
          <p>No books found matching your criteria.</p>
          <button on:click={clearFilters}>Clear Filters</button>
        </div>
      {/snippet}
    </Card>
  {/if}
</div>

<style>
  h2 {
    color: var(--color-bg);
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
    margin-bottom: 0;
  }

  .filter-field label {
    color: var(--color-bg);
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.875);
    font-weight: 600;
  }

  .filter-field input {
    background-color: white;
    border: none;
    border-bottom: 1px dotted var(--color-bg);
    color: var(--color-bg);
    font-family: var(--font-serif);
    padding: calc(var(--unit) * 0.125);
  }

  .filter-field input:focus {
    outline: none;
    border-color: var(--color-bg);
  }

  .filter-actions button {
    background: transparent;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    font-family: var(--font-serif);
    padding: calc(var(--unit) * 0.25);
  }

  .current-filter {
    margin-top: calc(var(--unit) * 0.25);
    color: var(--color-offset);
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.875);
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
  }

  .clear-field-btn {
    background: none;
    border: none;
    color: var(--color-offset);
    cursor: pointer;
    font-size: calc(var(--unit) * 0.875);
    padding: 0;
    opacity: 0.7;
  }

  .clear-field-btn:hover {
    opacity: 1;
  }

  .no-results {
    text-align: center;
    color: var(--color-bg);
  }

  .no-results p {
    margin-bottom: calc(var(--unit) * 0.5);
  }

  .no-results button {
    background: transparent;
    border: 1px solid var(--color-offset);
    color: var(--color-bg);
    cursor: pointer;
    font-family: var(--font-serif);
    padding: calc(var(--unit) * 0.375) calc(var(--unit) * 0.75);
    border-radius: calc(var(--unit) * 0.125);
  }
</style>
