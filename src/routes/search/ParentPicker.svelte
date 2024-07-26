<script>
  import { saxio } from '$lib/api';
  import { debounce } from '$lib/util';
  import Picker from './Picker.svelte';
  /** @typedef {import('$lib/api').Collection} Collection */

  /** @type {Collection[]} */
  export let chosen;
  /** @type {Collection[]} */
  let fetched = [];

  let keyword = '';

  const fetchCollections = debounce(() => {
    saxio?.post('/collection', { keyword }).then(res => {
      fetched = res.data.collections;
    }).catch((err) => {
      console.error(err);
    });
  }, 300);

  const handleInput = () => {
    fetchCollections();
    // TODO fetch info for chosen
  };

</script>

<Picker title="Collections" id="collections"
  bind:fullList={fetched} bind:chosen={chosen} bind:keyword={keyword} initFunc={fetchCollections}
  handleInput={handleInput}
/>

