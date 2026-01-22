<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<div class="impact-aurora"></div>
<div class="impact-orbs">
  <div class="impact-orb"></div>
  <div class="impact-orb"></div>
  <div class="impact-orb"></div>
</div>
<div class="impact-particles">
  {#each Array(9) as _}
    <div class="impact-particle"></div>
  {/each}
</div>

<main class="impact-body">
  {@render children()}
</main>

<style>
  /* Override impact-body to not center content by default if it does */
  .impact-body {
    display: block; /* Override flex center if needed */
    padding: 0;
    width: 100%;
    min-height: 100vh;
  }
</style>
