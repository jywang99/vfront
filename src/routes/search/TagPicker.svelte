<script>
  import { saxio } from '$lib/api';
  import { debounce } from '$lib/util';
  import Picker from './Picker.svelte';
  /** @typedef {import('$lib/api').Tag} Tag */

  /** @type {Tag[]} */
  export let chosen;
  /** @type {Tag[]} */
  let fetched = [];

  let keyword = '';

  const fetchTags = debounce(() => {
    saxio?.post('/tag', { keyword }).then(res => {
      fetched = res.data.tags;
    }).catch((err) => {
      console.error(err);
    });
  }, 300);

  const handleInput = () => {
    fetchTags();
    // TODO fetch info for chosen
  };
</script>

<Picker title="Tags" id="tags"
  bind:fullList={fetched} bind:chosen={chosen} bind:keyword={keyword} initFunc={fetchTags}
  handleInput={handleInput}
/>

