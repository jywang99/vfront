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

<nav>
  <a href="/">Home</a>
  {#if loggedIn}
    <a href="/search">Search</a>
  {/if}
</nav>

<slot />

<style>
  nav {
    display: flex;
    gap: 1rem;
    padding-bottom: .5rem;
    margin-bottom: .5rem;
  }
</style>

