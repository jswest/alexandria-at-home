<script>
  import Header from "$lib/components/Header.svelte";
  let { children } = $props();
</script>

<div class="Layout">
  <Header />
  <main>{@render children()}</main>
</div>

<style>
  main {
    padding-top: calc(var(--unit) * 4);
  }
</style>