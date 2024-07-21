<script>
  import { localUser } from "$lib/storable";

  /** import("$lib/storable").User | null */
  let user = null;
  let loggedIn = false;
  localUser.subscribe((value) => {
    user = value;
    loggedIn = value !== null;
  });
</script>

<h1>Welcome{loggedIn ? `, ${user.name}` : ''}</h1>
{#if !loggedIn}
  <a href="/login">Login</a>
  <br />
  <a href="/regist">Sign up</a>
{:else}
  <button on:click={() => localUser.set(null)}>Logout</button>
{/if}

