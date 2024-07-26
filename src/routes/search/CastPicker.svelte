<script>
  import { saxio } from '$lib/api';
  import { debounce } from '$lib/util';
  import Picker from './Picker.svelte';
  /** @typedef {import('$lib/api').Cast} Cast */

  /** @type {Cast[]} */
  export let chosen;
  /** @type {Cast[]} */
  let fetched = [];

  let keyword = '';

  const fetchCasts = debounce(() => {
    saxio?.post('/cast', { keyword }).then(res => {
      fetched = res.data.casts;
    }).catch((err) => {
      console.error(err);
    });
  }, 300);

  const handleInput = () => {
    fetchCasts();
    // TODO fetch info for chosen
  };
</script>

<Picker title="Casts" id="casts"
  bind:fullList={(fetched)} bind:chosen={chosen} bind:keyword={keyword} initFunc={fetchCasts}
  handleInput={handleInput}
/>

