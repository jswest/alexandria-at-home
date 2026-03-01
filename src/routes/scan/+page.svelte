<script>
  import { goto } from "$app/navigation";
  import { AlertTriangle, RotateCcw } from "lucide-svelte";

  import Barcode from "$lib/components/Barcode.svelte";
  import Card from "$lib/components/Card.svelte";

  let error = null;
  let retryCount = 0;

  const handleCode = async (isbn) => {
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isbn }),
      });
      const data = await res.json();
      if (data?.book) {
        await goto(`/books/${data.book.id}`);
      } else {
        error = {
          message: `Could not find book for ISBN ${isbn}`,
          detail: data?.error || "No results from Google Books API",
        };
      }
    } catch (err) {
      error = {
        message: "Network error while looking up book",
        detail: err.message,
      };
    }
  };

  const handleError = (err) => {
    error = {
      message: "Scanner failed to start",
      detail: err?.message || String(err),
    };
  };

  function handleRetry() {
    error = null;
    retryCount += 1;
  }
</script>

{#if error}
  <div class="error-container">
    <Card variant="white" size="small" topBorder={true}>
      {#snippet children()}
        <div class="sub-card">
          <h2 class="error-heading">
            <AlertTriangle size="16" />
            {error.message}
          </h2>
        </div>
        <div class="sub-card">
          <p class="error-detail">{error.detail}</p>
        </div>
        <div class="sub-card">
          <button class="retry-btn" on:click={handleRetry}>
            <RotateCcw size="14" />
            Try Again
          </button>
        </div>
      {/snippet}
    </Card>
  </div>
{:else}
  {#key retryCount}
    <Barcode onDetected={handleCode} onError={handleError} />
  {/key}
{/if}

<style>
  .error-container {
    display: flex;
    justify-content: center;
    padding-top: 20vh;
  }
  .error-heading {
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
    color: var(--color-bg);
  }
  .error-detail {
    font-size: calc(var(--unit) * 0.65);
    color: var(--color-offset);
    font-family: monospace;
  }
  .retry-btn {
    background: transparent;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    font-family: var(--font-serif);
    font-size: var(--unit);
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
    padding: calc(var(--unit) * 0.25);
  }
  .retry-btn:hover {
    text-decoration: underline;
  }
</style>
