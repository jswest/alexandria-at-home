<script>
  import { User, ChevronLeft, ChevronRight } from "lucide-svelte";

  export let data;
  const { authors, pagination } = data;

  function formatBornYear(bornAt) {
    if (!bornAt) return null;
    return bornAt instanceof Date
      ? bornAt.getFullYear()
      : bornAt.split("-")[0];
  }
</script>

<div class="Page">
  <header class="faux-card">
    <div class="sub-card">
      <h1 class="title">Authors</h1>
      <p>
        Showing {authors.length} of {pagination.totalAuthors} authors
        (Page {pagination.currentPage} of {pagination.totalPages})
      </p>
    </div>
  </header>

  <div class="authors-grid">
    {#each authors as author}
      <div class="author-card">
        <div class="author-header sub-card">
          <h2>
            <User size="14" />
            <a href="/authors/{author.id}">{author.name}</a>
          </h2>
          {#if author.bornAt}
            <p class="born-year">Born {formatBornYear(author.bornAt)}</p>
          {/if}
        </div>
        
        <div class="book-count sub-card">
          <p>{author.books.length} book{author.books.length === 1 ? '' : 's'}</p>
        </div>
      </div>
    {/each}
  </div>

  {#if pagination.totalPages > 1}
    <div class="pagination">
      <div class="pagination-controls faux-card">
        <div class="sub-card">
          {#if pagination.hasPreviousPage}
            <a href="?page={pagination.currentPage - 1}" class="pagination-btn">
              <ChevronLeft size="14" />
              Previous
            </a>
          {:else}
            <span class="pagination-btn disabled">
              <ChevronLeft size="14" />
              Previous
            </span>
          {/if}

          <span class="page-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          {#if pagination.hasNextPage}
            <a href="?page={pagination.currentPage + 1}" class="pagination-btn">
              Next
              <ChevronRight size="14" />
            </a>
          {:else}
            <span class="pagination-btn disabled">
              Next
              <ChevronRight size="14" />
            </span>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .faux-card {
    background-color: var(--color-bg);
    border: 1px solid var(--color-offset);
    border-top: 5px solid var(--color-offset);
    box-sizing: border-box;
    float: left;
    margin: var(--unit);
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

  .authors-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--unit);
    margin: var(--unit);
  }

  .author-card {
    background-color: #ececec;
    border-top: 5px solid var(--color-offset);
    box-sizing: border-box;
    padding: var(--unit);
  }

  .author-header h2 {
    color: var(--color-bg);
    line-height: 1;
    margin-bottom: calc(var(--unit) * 0.5);
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
  }

  .author-header h2:hover a {
    text-decoration: underline;
  }

  .born-year {
    color: var(--color-bg);
    font-size: calc(var(--unit) * 0.85);
    margin-bottom: 0;
  }

  .book-count p {
    color: var(--color-bg);
    font-size: calc(var(--unit) * 0.85);
    margin-bottom: 0;
  }

  .pagination {
    clear: both;
    margin-top: calc(var(--unit) * 2);
  }

  .pagination-controls {
    max-width: 600px;
    margin: 0 auto;
  }

  .pagination-controls .sub-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--unit);
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
    color: var(--color-offset);
    text-decoration: none;
    font-family: var(--font-serif);
  }

  .pagination-btn:hover:not(.disabled) {
    text-decoration: underline;
  }

  .pagination-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    color: var(--color-offset);
    font-family: var(--font-serif);
  }
</style>