<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { saxio } from '$lib/api';
  import Paging from '$lib/Paging.svelte';
    import Tag from '$lib/Tag.svelte';

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
  let pageSize = 100;

  /** @type {import('$lib/api').Tag[]} */
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
    saxio?.post('/tag', { 
      paging
    }).then(res => {
      fetched = res.data.tags;
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

  // put tags into alpha groups by first letter
  /** @typedef
    * {{ letter: string, tags: import('$lib/api').Tag[] }}
    * AlphaTag
    */
  /** @type {AlphaTag[]} */
  let alphaTags = [];
  $: {
    const tags = fetched;
    const alphaMap = new Map();
    for (const tag of tags) {
      const letter = tag.name[0].toUpperCase();
      if (!alphaMap.has(letter)) {
        alphaMap.set(letter, []);
      }
      alphaMap.get(letter).push(tag);
    }
    alphaTags = Array.from(alphaMap.entries()).map(([letter, tags]) => ({ letter, tags }));
  }
</script>

<svelte:head>
    <title>Collections</title> 
</svelte:head>

<Paging bind:paging bind:grandTotal />

<div class="contents">
  {#if fetching}
    <p>Fetching...</p>
  {:else}
    {#each alphaTags as { letter, tags }}
      <h2>{letter}</h2>
      {#each tags as tag}
        <Tag {tag} />
      {/each}
    {/each}
  {/if}
</div>

<Paging bind:paging bind:grandTotal />

