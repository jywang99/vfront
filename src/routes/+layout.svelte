<script>
  import { localUser } from "$lib/storable";

  /** import("$lib/storable").User */
  let user = null;
  let loggedIn = false;
  localUser.subscribe((value) => {
    user = value;
    loggedIn = value !== null;
  });
</script>

<div class="container">
  <nav>
    <a href="/">Home</a>
    {#if loggedIn}
      <a href="/search">Search</a>
    {/if}
  </nav>

  <slot />
</div>

<footer>
</footer>

<style>
  .container {
    padding: 8px;
  }

  nav {
    display: flex;
    gap: 1rem;
    padding-bottom: .5rem;
    margin-bottom: .5rem;
  }

  footer {
    margin-top: 1rem;
    padding: 1rem;
    display: flex;
    justify-content: center;
    background-color: #f0f0f0;
    min-height: 100px;
  }
</style>

