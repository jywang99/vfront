<script>
  import { saxio } from '$lib/api';
  import { debounce } from '$lib/util';
  import Picker from './Picker.svelte';
  /** @typedef {import('$lib/api').Tag} Tag */

  /** @type {Tag[]} */
  export let chosen;
  /** @type {Tag[]} */
  let fetched = [];
  let fetching = false;
  let chosenFetching = false;

  let keyword = '';

  const fetchTags = debounce(() => {
    fetching = true;
    saxio?.post('/tag', { keyword }).then(res => {
      fetched = res.data.tags;
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      fetching = false;
    });
  }, 300);

  function fetchChosen() {
    if (chosen.length === 0 || chosen[0].name) return;

    chosenFetching = true;
    saxio?.post('/tag/ids', { ids: chosen.map((c) => c.id) }).then(res => {
      chosen = res.data;
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      chosenFetching = false;
    });
  }

  function init() {
    fetchTags();
    fetchChosen();
  }

  const handleInput = () => {
    fetchTags();
    // TODO fetch info for chosen
  };
</script>

<Picker title="Tags" id="tags"
  bind:fullList={fetched} bind:chosen={chosen} bind:keyword={keyword} initFunc={init}
  bind:fullLoading={fetching} bind:chosenLoading={chosenFetching}
  handleInput={handleInput}
/>

