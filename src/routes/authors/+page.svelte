<script>
  import { Check, Filter, X } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import AuthorCard from "$lib/components/AuthorCard.svelte";
  import Card from "$lib/components/Card.svelte";
  import Pagination from "$lib/components/Pagination.svelte";

  export let data;
  
  $: ({ authors, pagination, filters } = data);
  $: nameFilter = filters.name || "";
  $: birthYearFrom = filters.birthYearFrom || "";
  $: birthYearTo = filters.birthYearTo || "";

  function applyFilters() {
    const params = new URLSearchParams();

    if (nameFilter.trim()) params.set("name", nameFilter.trim());
    if (birthYearFrom && String(birthYearFrom).trim()) params.set("birthYearFrom", String(birthYearFrom).trim());
    if (birthYearTo && String(birthYearTo).trim()) params.set("birthYearTo", String(birthYearTo).trim());

    // Reset to page 1 when applying filters
    params.set("page", "1");

    goto(`?${params.toString()}`);
  }

  function clearFilters() {
    nameFilter = "";
    birthYearFrom = "";
    birthYearTo = "";
    goto("/authors");
  }

</script>

<div class="Page">
  <!-- Filters -->
  <Card variant="white" size="medium">
    {#snippet children()}
      <div class="sub-card">
        <h2>
          <Filter size="14" />
          Filters
        </h2>
      </div>
      <div class="sub-card filters">
        <div class="filter-field">
          <label for="name">Author name</label>
          <input
            id="name"
            bind:value={nameFilter}
            placeholder="Search by name"
            type="text"
            on:keydown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
      </div>
      <div class="sub-card filters">
        <div class="filter-field">
          <label for="birthYearFrom">Born after</label>
          <input
            id="birthYearFrom"
            bind:value={birthYearFrom}
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
          <label for="birthYearTo">Born until</label>
          <input
            id="birthYearTo"
            bind:value={birthYearTo}
            placeholder="2000"
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
    itemType="authors"
    currentCount={authors.length}
    totalCount={pagination.totalAuthors}
    hasFilters={filters.name || filters.birthYearFrom || filters.birthYearTo}
    size="medium"
  />
  <div class="authors-grid">
    {#each authors as author}
      <AuthorCard {author} />
    {/each}
  </div>
  {#if authors.length === 0}
    <Card variant="white">
      {#snippet children()}
        <div class="sub-card no-results">
          <p>No authors found matching your criteria.</p>
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
  .filters {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: calc(var(--unit) * 0.5);
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
    padding: calc(var(--unit) * 0.25)
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
