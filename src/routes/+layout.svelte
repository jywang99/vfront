<script>
  import { page } from "$app/stores";
  import { localUser } from "$lib/storable";
  import NavLink from "./NavLink.svelte";

  let curPath;
  $: curPath = $page.url.pathname;

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
    <NavLink href="/" {curPath}>Home</NavLink>
    {#if loggedIn}
      <NavLink href="/search/" {curPath}>Search</NavLink>
      <NavLink href="/collection/" {curPath}>Collections</NavLink>
      <NavLink href="/tag/" {curPath}>Tags</NavLink>
      <NavLink href="/cast/" {curPath}>Casts</NavLink>
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

