<script>
  import { Check } from "lucide-svelte";

  const { 
    apiEndpoint,
    placeholder = "Search...",
    onSubmit,
    displayField = "name",
    name = "autocomplete",
    icon
  } = $props();

  let value = $state("");
  let suggestions = $state([]);
  let selectedIndex = $state(-1);
  let showSuggestions = $state(false);
  let inputElement;

  async function fetchSuggestions(query) {
    if (query.length >= 1) {
      const response = await fetch(`${apiEndpoint}?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Handle different response structures
      const items = data.tags || data.authors || data.publishers || data.items || [];
      suggestions = items;
      showSuggestions = suggestions.length > 0;
      selectedIndex = -1;
    } else {
      suggestions = [];
      showSuggestions = false;
      selectedIndex = -1;
    }
  }

  function handleInput(event) {
    value = event.target.value;
    fetchSuggestions(value);
  }

  function handleKeydown(event) {
    if (!showSuggestions) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitValue();
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        break;
      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex]);
        } else {
          submitValue();
        }
        break;
      case "Escape":
        event.preventDefault();
        showSuggestions = false;
        selectedIndex = -1;
        break;
    }
  }

  function selectSuggestion(item) {
    value = item[displayField];
    showSuggestions = false;
    selectedIndex = -1;
    submitValue();
  }

  function submitValue() {
    if (value.trim()) {
      onSubmit(value.trim());
      value = "";
      suggestions = [];
      showSuggestions = false;
      selectedIndex = -1;
    }
  }

  function handleBlur(event) {
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      showSuggestions = false;
      selectedIndex = -1;
    }, 150);
  }
</script>

<div class="autocomplete-container">
  <div class="input-wrapper">
    {#if icon}
      {@render icon()}
    {/if}
    <input
      bind:this={inputElement}
      bind:value={value}
      {name}
      oninput={handleInput}
      onkeydown={handleKeydown}
      onblur={handleBlur}
      {placeholder}
      type="text"
      autocomplete="off"
    />
    <button onclick={submitValue} type="button">
      <Check size="14" />
    </button>
  </div>
  
  {#if showSuggestions}
    <div class="suggestions">
      {#each suggestions as suggestion, index}
        <button
          class="suggestion"
          class:selected={index === selectedIndex}
          onclick={() => selectSuggestion(suggestion)}
          type="button"
        >
          {suggestion[displayField]}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  button {
    border: none;
    background: transparent;
    color: var(--color-bg);
    cursor: pointer;
  }
  .autocomplete-container {
    position: relative;
  }
  .input-wrapper {
    display: flex;
    align-items: center;
    gap: calc(var(--unit) * 0.25);
  }
  input {
    background-color: transparent;
    border-bottom-color: var(--color-bg);
    color: var(--color-bg);
    flex: 1;
  }
  .suggestions {
    background-color: var(--color-offset-light);
    border: 1px solid var(--color-offset);
    border-top: none;
    left: 0;
    max-height: 200px;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 100;
  }
  .suggestion {
    background: transparent;
    border: none;
    border-bottom: 1px solid var(--color-offset);
    color: var(--color-bg);
    cursor: pointer;
    font-family: var(--font-serif);
    font-size: calc(var(--unit) * 0.75);
    padding: calc(var(--unit) * 0.25);
    text-align: left;
    width: 100%;
  }
  .suggestion:last-child {
    border-bottom: none;
  }
  .suggestion:hover,
  .suggestion.selected {
    background-color: var(--color-offset-medium);
  }
</style>