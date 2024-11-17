<script>
  import { goto } from '$app/navigation';

  import { Save } from "lucide-svelte";

  let authorNames = "";
  let isbn = "";
  let publishedAt = "";
  let publisherName = "";
  let subtitle = "";
  let title = "";
  async function handleSave() {
    try {
      const response = await fetch(`/api/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorNames: [...authorNames.split(", ")]
            .map((authorName) => authorName.trim())
            .join(","),
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

<div class="CreateBook">
  <header class="sub-card">
    <h1>Create a book.</h1>
  </header>
  <div class="sub-card">
    <input bind:value={title} placeholder="Title" type="text" />
    <input bind:value={subtitle} placeholder="Subtitle" type="text" />
    <input bind:value={isbn} placeholder="ISBN" type="text" />
  </div>
  <div class="sub-card">
    <input bind:value={authorNames} placeholder="Author name" type="text" />
  </div>
  <div class="sub-card">
    <input
      bind:value={publishedAt}
      placeholder="Publication year"
      type="text"
    />
    <input
      bind:value={publisherName}
      placeholder="Publisher name"
      type="text"
    />
  </div>
  <footer class="sub-card">
    <Save size="12" />
    <button on:click={handleSave}> Save </button>
  </footer>
</div>

<style>
  .CreateBook {
    border: 1px solid var(--color-offset);
    box-sizing: border-box;
    float: left;
    height: 300px;
    margin: var(--unit);
    overflow: scroll;
    padding: var(--unit);
    width: 300px;
  }
  h1 {
    color: var(--color-offset);
    font-size: calc(var(--unit) * 1.75);
    line-height: 1;
    transform: scaleX(0.7);
    transform-origin: 0 50%;
    width: calc(100% * 1.4285714286);
  }
  .sub-card {
    border-left: 1px solid var(--color-offset);
  }
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
</style>
