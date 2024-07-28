<script>
  import { saxio } from '$lib/api';
  import { debounce } from '$lib/util';
  import Picker from './Picker.svelte';
  /** @typedef {import('$lib/api').Collection} Collection */

  /** @type {Collection[]} */
  export let chosen;
  /** @type {Collection[]} */
  let fetched = [];
  let fetching = false;
  let chosenFetching = false;

  let keyword = '';

  const fetchCollections = debounce(() => {
    fetching = true;
    saxio?.post('/collection', { keyword }).then(res => {
      fetched = res.data.collections;
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      fetching = false;
    });
  }, 300);

  function fetchChosen() {
    if (chosen.length === 0 || chosen[0].name) return;

    chosenFetching = true;
    saxio?.post('/collection/ids', { ids: chosen.map((c) => c.id) }).then(res => {
      chosen = res.data;
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      chosenFetching = false;
    });
  }

  function init() {
    fetchCollections();
    fetchChosen();
  }

  const handleInput = () => {
    fetchCollections();
    // TODO fetch info for chosen
  };

</script>

<Picker title="Collections" id="collections"
  bind:fullList={fetched} bind:chosen={chosen} bind:keyword={keyword} initFunc={init}
  handleInput={handleInput}
/>

