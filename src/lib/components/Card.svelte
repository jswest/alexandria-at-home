<script>
  const {
    variant = "light", // "light", "dark", "white"
    width = "300px",
    maxWidth = "300px",
    overflow = "scroll",
    topBorder = true,
    size = "medium", // "large", "medium", "small"
    children,
  } = $props();

  function getBackgroundColor(variant) {
    switch (variant) {
      case "dark":
        return "var(--color-bg)";
      case "white":
        return "white";
      case "light":
      default:
        return "#ececec";
    }
  }

  function getSubCardBorderColor(variant) {
    switch (variant) {
      case "dark":
        return "var(--color-offset)";
      case "white":
      case "light":
      default:
        return "black";
    }
  }
</script>

<div
  class:Card={true}
  class:large={size === "large"}
  class:medium={size === "medium"}
  class:small={size === "small"}
  style:background-color={getBackgroundColor(variant)}
  style:width
  style:max-width={maxWidth}
  style:overflow
  style:border-top={topBorder
    ? "5px solid var(--color-offset)"
    : "1px solid var(--color-offset)"}
  style:--sub-card-border-color={getSubCardBorderColor(variant)}
>
  <div class="guts">
    {@render children()}
  </div>
</div>

<style>
  .Card {
    border: 1px solid var(--color-offset);
    box-sizing: border-box;
    float: left;
    margin: var(--unit);
    text-align: left;
  }
  .Card.small {
    height: 200px;
  }
  .Card.medium {
    height: 435px;
  }
  .Card.large {
    height: 600px;
  }
  .guts {
    padding: var(--unit);
  }
  .Card :global(.sub-card) {
    border-left-color: var(--sub-card-border-color);
  }
  .Card:has(.guts) :global(h1) {
    color: var(--color-offset);
    font-size: calc(var(--unit) * 1.75);
    line-height: 1;
    transform: scaleX(0.7);
    transform-origin: 0 50%;
    width: calc(100% * 1.4285714286);
  }
  .Card:has(.guts) :global(h1 .lighter) {
    font-weight: 100;
  }
  .Card:has(.guts) :global(h2) {
    line-height: 1;
    margin-bottom: 0;
  }
  .Card :global(input) {
    background-color: white;
    color: var(--color-bg);
  }
  .Card :global(.title) {
    color: var(--color-bg);
    font-weight: 800;
  }
  .Card :global(.subtitle) {
    color: var(--color-offset);
    font-weight: 100;
  }
  .Card :global(.author-born-at),
  .Card :global(.published-at) {
    font-weight: 400;
  }
  .Card :global(p) {
    margin-bottom: 0;
  }
  .Card :global(h1:hover a),
  .Card :global(h2:hover a) {
    text-decoration: underline;
  }
</style>
