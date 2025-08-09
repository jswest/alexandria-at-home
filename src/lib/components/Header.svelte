<script>
  import { List, Scan, Users } from "lucide-svelte";
</script>

<header class="Header">
  <div>
    <div class="nav-element">
      <h1><a href="/">Alexandria at Home</a></h1>
    </div>
    <div class="nav-element">
      <p>
        <a class="icon" href="/scan">
          <Scan size="24" />
        </a>
        <a class="icon" href="/books">
          <List size="24" />
        </a>
        <a class="icon" href="/authors">
          <Users size="24" />
        </a>
      </p>
    </div>
  </div>
  <div style="clear:both;"></div>
</header>

<style>
  .Header {
    background-color: var(--color-bg);
    border-bottom: 1px solid var(--color-offset);
    box-sizing: border-box;
    height: calc((var(--unit) * 3) + 1px);
    padding: calc(var(--unit) * 0.5) var(--unit);
    position: fixed;
    width: 100%;
    z-index: 10;
  }
  .nav-element {
    float: right;
    width: auto;
  }
  .nav-element:first-child {
    float: left;
    width: 210px;
  }
  .icon {
    margin-right: var(--unit);
  }
  .icon:last-child {
    margin-right: 0;
  }
  h1 {
    color: var(--color-offset);
    font-size: calc(var(--unit) * 2);
    line-height: 1;
    transform: scaleX(0.7);
    transform-origin: 0% 50%;
    width: calc(100% * 1.4285714286);
  }
  p {
    color: var(--color-offset);
    margin: calc(var(--unit) * 0.25) 0 0 0;
  }
</style>
