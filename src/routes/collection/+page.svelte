<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { saxio } from '$lib/api';
  import Paging from '$lib/Paging.svelte';
  import { onMount } from 'svelte';
  import Collection from './Collection.svelte';

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
  let pageSize = 10;

  /** @type {import('$lib/api').Collection[]} */
  let fetched = [];
  let fetching = false;

  const paging = {
    desc: true,
    pageSize,
    getTotal: true,
    offset,
  };
  /** @param {number} newOffset */
  const fetchCollections = (newOffset) => {
    offset = newOffset;
    updateSearchParams('offset', offset.toString());
    paging.offset = newOffset;

    fetching = true;
    saxio?.post('/collection', { 
      paging
    }).then(res => {
      fetched = res.data.collections;
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
  onMount(() => {
    fetchCollections(offset);
  });
</script>

<svelte:head>
    <title>Collections</title> 
</svelte:head>

<Paging {offset} {grandTotal} {pageSize} onOffsetChange={fetchCollections} />

<div class="contents">
  {#if fetching}
    <p>Fetching...</p>
  {:else}
    {#each fetched as collection}
      <Collection {collection} />
    {/each}
  {/if}
</div>

<Paging {offset} {grandTotal} {pageSize} onOffsetChange={fetchCollections} />

