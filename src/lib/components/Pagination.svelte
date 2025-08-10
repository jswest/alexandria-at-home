<script>
  import { Book, ChevronLeft, ChevronRight } from "lucide-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Card from "$lib/components/Card.svelte";

  const {
    currentCount,
    hasFilters = false,
    itemType = "items",
    pagination,
    size = "small",
    totalCount,
  } = $props();

  function navigateToPage(pageNum) {
    const params = new URLSearchParams($page.url.searchParams);
    params.set("page", pageNum.toString());
    const newUrl = `${$page.url.pathname}?${params.toString()}`;
    goto(newUrl, { replaceState: false });
  }
</script>

{#if pagination.totalPages > 0}
  <Card variant="white" size={size}>
    {#snippet children()}
      <div class="sub-card results-summary">
        <Book size={14} />
        Showing {currentCount} of {totalCount}
        {itemType}
        {#if hasFilters}
          <span class="filtered">(filtered)</span>
        {/if}
      </div>

      {#if pagination.totalPages > 1}
        <div class="sub-card pagination-content">
          <p>
            <span class="page-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
          </p>
        </div>
        <div class="sub-card pagination-content">
          <p>
            {#if pagination.hasPreviousPage}
              <button
                onclick={() => navigateToPage(pagination.currentPage - 1)}
                class="pagination-btn"
              >
                <ChevronLeft size="14" />
                Previous
              </button>
            {:else}
              <span class="pagination-btn disabled">
                <ChevronLeft size="14" />
                Previous
              </span>
            {/if}
            {#if pagination.hasNextPage}
              <button
                onclick={() => navigateToPage(pagination.currentPage + 1)}
                class="pagination-btn"
              >
                <ChevronRight size="14" />
                Next
              </button>
            {:else}
              <span class="pagination-btn disabled">
                <ChevronRight size="14" />
                Next
              </span>
            {/if}
          </p>
        </div>
      {/if}
    {/snippet}
  </Card>
{/if}

<style>
  .results-summary {
    color: var(--color-bg);
    font-family: var(--font-serif);
    font-size: var(--unit);
    font-weight: 800;
  }
  .filtered {
    color: var(--color-offset);
    font-style: italic;
  }
  .page-info {
    color: var(--color-bg);
    font-weight: 900;
  }
  .pagination-btn {
    align-items: center;
    background: transparent;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    display: inline-flex;
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.75);
    margin-right: calc(var(--unit) * 0.25);
    padding: calc(var(--unit) * 0.25);
    text-decoration: none;
  }
  .pagination-btn:hover:not(.disabled) {
    text-decoration: underline;
  }
  .pagination-btn.disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
