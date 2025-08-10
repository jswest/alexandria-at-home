<script>
  import { Calendar, User, Edit, Check, X, Trash2 } from "lucide-svelte";
  import Card from "$lib/components/Card.svelte";

  const { author } = $props();

  let editing = $state(false);
  let editedName = $state(author.name);
  let editedBornAt = $state("");

  // Parse birth year from various date formats
  function formatBornYear(bornAt) {
    if (!bornAt) return null;
    return bornAt instanceof Date ? bornAt.getFullYear() : bornAt.split("-")[0];
  }

  // Initialize edited birth year
  $effect(() => {
    if (author.bornAt) {
      editedBornAt = formatBornYear(author.bornAt) || "";
    }
  });

  function handleEdit() {
    editing = true;
    editedName = author.name;
    editedBornAt = author.bornAt ? formatBornYear(author.bornAt) || "" : "";
  }

  function handleCancel() {
    editing = false;
    editedName = author.name;
    editedBornAt = author.bornAt ? formatBornYear(author.bornAt) || "" : "";
  }

  async function handleSave() {
    try {
      const response = await fetch(`/api/authors/${author.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          bornAt: editedBornAt ? new Date(`${editedBornAt}-01-01`).toISOString() : null,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // Update the author object to trigger reactivity
        Object.assign(author, data.author);
        editing = false;
      }
    } catch (error) {
      console.error("Error saving author:", error);
    }
  }

  async function handleDelete() {
    if (confirm(`Are you sure you want to delete "${author.name}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/authors/${author.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          // Emit a custom event to notify parent component
          window.location.reload(); // Simple approach for now
        }
      } catch (error) {
        console.error("Error deleting author:", error);
      }
    }
  }
</script>

<Card variant="white" size="small">
  {#snippet children()}
    {#if editing}
      <div class="title sub-card editing">
        <div class="edit-field">
          <input bind:value={editedName} placeholder="Author Name" type="text" />
          <button onclick={handleSave}><Check size="12" /></button>
          <button onclick={handleCancel}><X size="12" /></button>
        </div>
        <div class="edit-field">
          <input bind:value={editedBornAt} placeholder="Birth Year" type="text" />
        </div>
      </div>
    {:else}
      <div class="title sub-card">
        <h1>
          <a href="/authors/{author.id}">
            <span class="title">{author.name}</span>
          </a>
        </h1>
      </div>
    {/if}
    {#if !editing && author.bornAt}
      <div class="author sub-card">
        <h2 class="author-name">
          <Calendar size="14" strokeWidth="2" />
          Born {formatBornYear(author.bornAt)}
        </h2>
      </div>
    {/if}
    <div class="author sub-card">
      <h2 class="author-name">
        <User size="14" />
        {author.books.length} book{author.books.length === 1 ? "" : "s"}
      </h2>
    </div>
    {#if !editing}
      <div class="edit-controls sub-card">
        <button onclick={handleEdit}>
          <Edit size="12" />
          Edit
        </button>
        <button class="delete-btn" onclick={handleDelete}>
          <Trash2 size="12" />
          Delete
        </button>
      </div>
    {:else}
      <div class="edit-controls sub-card">
        <button onclick={handleSave}>
          <Check size="14" />
          Save All
        </button>
        <button onclick={handleCancel}>
          <X size="14" />
          Cancel
        </button>
      </div>
    {/if}
  {/snippet}
</Card>

<style>
  h1 {
    color: var(--color-bg);
  }
  h1:hover a {
    text-decoration: underline;
  }
  h2 {
    color: var(--color-bg);
    margin-bottom: 0;
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
  }
  .editing {
    background-color: var(--color-offset-transparent);
    border-left-color: var(--color-offset) !important;
  }
  .edit-field {
    margin-bottom: calc(var(--unit) * 0.25);
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
  .edit-controls button {
    background: transparent;
    border: none;
    color: var(--color-bg);
    cursor: pointer;
    font-family: var(--font-serif);
    padding: calc(var(--unit) * 0.25);
  }
</style>