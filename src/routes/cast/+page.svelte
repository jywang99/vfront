<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { saxio } from '$lib/api';
    import Cast from '$lib/Cast.svelte';
  import Paging from '$lib/Paging.svelte';

  const params = $page.url.searchParams

  /**
   * @param {string} key
   * @param {string} value
   */
  const updateSearchParams = (key, value) => {
    const url = new URL(location.href);
    url.searchParams.set(key, value);
    goto(url.toString(), { replaceState: true });
  };

  /** @type {number} */
  let offset = params.get('offset') ? parseInt(params.get('offset') ?? '0') : 0;
  /** @type {number} */
  let grandTotal = 0;
  /** @type {number} */
  let pageSize = 50;

  /** @type {import('$lib/api').Cast[]} */
  let fetched = [];
  let fetching = false;

  let paging = {
    desc: false,
    by: 'name',
    pageSize,
    getTotal: true,
    offset,
  };

  const fetchCollections = () => {
    updateSearchParams('offset', paging.offset.toString());

    fetching = true;
    saxio?.post('/cast', { 
      paging
    }).then(res => {
      fetched = res.data.casts;
      if (paging.getTotal) {
        grandTotal = res.data.paging.total;
        paging.getTotal = false;
      }
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      fetching = false;
    });
  };
  $: if (paging.offset >= 0) fetchCollections();

  // put casts into alpha groups by first letter
  /** @typedef
    * {{ letter: string, tags: import('$lib/api').Cast[] }}
    * AlphaCast
    */
  /** @type {AlphaCast[]} */
  let alphaTags = [];
  $: {
    const casts = fetched;
    const alphaMap = new Map();
    for (const cast of casts) {
      if (!cast.name || cast.name.length === 0) {
        alphaMap.set('?', [cast]);
        continue;
      }

      const letter = cast.name[0].toUpperCase();
      if (!alphaMap.has(letter)) {
        alphaMap.set(letter, []);
      }
      alphaMap.get(letter).push(cast);
    }
    alphaTags = Array.from(alphaMap.entries()).map(([letter, tags]) => ({ letter, tags }));
  }
</script>

<svelte:head>
    <title>Casts</title> 
</svelte:head>

<Paging bind:paging bind:grandTotal />

<div class="contents">
  {#if fetching}
    <p>Fetching...</p>
  {:else}
    {#each alphaTags as { letter, tags }}
      <h2>{letter}</h2>
      <div class="casts">
        {#each tags as cast}
          <Cast {cast} />
        {/each}
      </div>
    {/each}
  {/if}
</div>

<Paging bind:paging bind:grandTotal />

<style>
  .casts {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
</style>

