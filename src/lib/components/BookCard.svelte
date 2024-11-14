<script>
  export let book;
  const { authors, subtitle, publisher, thumbnailUrl, title } = book;
</script>

<div class="BookCard">
  <div class="guts">
    <figure class="thumbnail">
      <img src={thumbnailUrl} alt={title} />
    </figure>
    <div class="details">
      <h1>
        <span class="title">{title}</span><span class="subtitle">{subtitle ? `: ${subtitle}` : ''}</span>
      </h1>
      <h2 class="author">By {authors.map((a) => a?.author?.name).join(" and ")}</h2>
      {#if publisher}
        <h2 class="publisher">Published by {publisher.name}</h2>
      {/if}
    </div>
    <div style="clear: both;"></div>
  </div>
</div>

<style>
  .BookCard {
    background-color: #ececec;
    border-radius: 4px;
    box-sizing: border-box;
    float: left;
    height: calc((var(--unit) * 3) + 200px);
    margin: var(--unit);
    overflow: scroll;
    width: 400px;
  }
  .guts {
    padding: var(--unit);
  }
  figure {
    border-radius: 4px;
    float: left;
    margin-right: var(--unit);
    overflow: hidden;
  }
  .details {
    float: left;
    width: calc(100% - (128px + (var(--unit) * 3)));
  }
  h1 {
    margin-bottom: 0;
  }
  h1 {
    font-size: calc(var(--unit) * 1.5);
    transform: scaleX(0.7);
    transform-origin: 0% 50%;
    width: calc(100% * 1.4285714286);
  }
  .title {
    font-weight: 800;
  }
  .subtitle {
    font-weight: 100;
  }
  h1, h2 {
    line-height: 1;
    margin-bottom: calc(var(--unit) * 0.5);
  }
  .publisher {
    font-weight: 400;
  }
</style>
