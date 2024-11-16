<script>
  import { Check, Edit, X } from "lucide-svelte";

  import BookCard from "$lib/components/BookCard.svelte";

  export let data;
  const { publisher } = data;
  const { books } = publisher;

  console.log(books)

  let editing = false;
  let editedName = publisher.name;

  function handleCancel() {
    editedName = publisher.name;
    editing = false;
  }

  async function handleSave() {
    try {
      const response = await fetch(`/api/publishers/${publisher.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName || publisher.name,
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
  <div class="Publisher">
    {#if editing}
      <header class="sub-card">
        <input bind:value={editedName} placeholder="name" type="text" />
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
          {publisher.name}
        </h1>
      </header>
      <div class="sub-card">
        <button on:click={() => (editing = true)}>
          <Edit size="12" />
          Edit publisher.
        </button>
      </div>
    {/if}
  </div>
  {#each books as book}
    <BookCard {book} />
  {/each}
</div>

<style>
  .Publisher {
    border: 1px solid var(--color-offset);
    border-top: 5px solid var(--color-offset);
    box-sizing: border-box;
    color: var(--color-offset);
    float: left;
    height: 300px;
    margin: var(--unit);
    overflow: scroll;
    padding: var(--unit);
    width: 300px;
  }
  .sub-card {
    border-left: 1px solid var(--color-offset);
  }
  h1 {
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
  button {
    background-color: transparent;
    border: none;
    color: var(--color-offset);
    cursor: pointer;
    font-family: "Cormorant Garamond";
    font-size: var(--unit);
    line-height: 1;
    margin: 0;
    outline: none;
  }
  input {
    width: calc(100% - 40px);
  }
</style>
