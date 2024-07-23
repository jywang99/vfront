<script>
  import { saxio } from '$lib/api';
  import { debounce } from '$lib/util';
  /** @typedef {import('$lib/api').Collection} Collection */

  /** @type {Collection[]} */
  export let chosen;
  /** @type {Collection[]} */
  let fullFetched = [];
  /** @type {Collection[]} */
  let fetched = [];

  let keyword = '';

  let inputFocused = false;
  let dropFocused = false;

  const fetchCollections = debounce(() => {
    saxio?.post('/collection', { keyword }).then(res => {
      fullFetched = res.data.collections;
    }).catch((err) => {
      console.error(err);
    });
  }, 300);

  const handleInput = () => {
    fetchCollections();
  };

  // initialization
  $: if (inputFocused && fullFetched.length === 0) handleInput();

  // fetched list should not include chosen
  $: if (chosen.length > 0) {
    fetched = fullFetched.filter((coll) => !chosen.some((c) => c.id === coll.id));
  } else {
    fetched = fullFetched;
  }
</script>

<div class="container">
  <label for="collections">Collections</label>
  <div class="input-wrap">
    <input type="text" id="collections" bind:value={keyword} on:input={handleInput}
      on:focusin={() => inputFocused = true} on:focusout={() => inputFocused = false} />

    <!-- dialog -->
    {#if inputFocused || dropFocused}
      <div class="dialog" on:mouseenter={() => dropFocused = true} on:mouseleave={() => dropFocused = false} role="dialog" >
        <div>
          <h3>Choose from</h3>
          <ul>
            {#each fetched as coll}
              <li>
                <button on:click|preventDefault={() => chosen = [...chosen, coll]}>{coll.name}</button>
              </li>
            {/each}
          </ul>
        </div>
        <div>
          <h3>Chosen</h3>
          <ul>
            {#each chosen as coll}
              <li>
                <button on:click|preventDefault={() => chosen = chosen.filter((c) => c.id !== coll.id)}>{coll.name}</button>
              </li>
            {/each}
          </ul>
          <button class="trash" on:click|preventDefault={() => chosen = []}>
            <img src="/trash.svg" alt="trash" />
          </button>
        </div>
      </div>
    {/if}

    <!-- badge -->
    {#if chosen.length > 0}
      <span class="badge">{chosen.length}</span>
    {/if}
  </div>
</div>

<style>
  @import './picker.css';
</style>

