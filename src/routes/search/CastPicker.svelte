<script>
  import { saxio } from '$lib/api';
  import Picker from './Picker.svelte';
  /** @typedef {import('$lib/api').Cast} Cast */

  /** @type {Cast[]} */
  export let chosen;
  /** @type {Cast[]} */
  let fetched = [];
  let fetching = false;
  let chosenFetching = false;

  let keyword = '';

  const fetchCasts = () => {
    fetching = true;
    saxio?.post('/cast', { keyword }).then(res => {
      fetched = res.data.casts;
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      fetching = false;
    });
  };

  function fetchChosen() {
    if (chosen.length === 0 || chosen[0].name) return;

    chosenFetching = true;
    saxio?.post('/cast/ids', { ids: chosen.map((c) => c.id) }).then(res => {
      chosen = res.data;
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      chosenFetching = false;
    });
  }

  function init() {
    fetchCasts();
    fetchChosen();
  }
</script>

<Picker title="Casts" id="casts"
  bind:fullList={fetched} bind:chosen={chosen} bind:keyword={keyword} initFunc={init}
  bind:fullLoading={fetching} bind:chosenLoading={chosenFetching}
  handleInput={fetchCasts}
/>

