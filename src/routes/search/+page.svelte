<script>
  import { saxio } from "$lib/api";
  import { onMount } from "svelte";
  import { page } from '$app/stores';
  import { goto } from "$app/navigation";
  import Entry from "./Entry.svelte";
  import Paging from "$lib/Paging.svelte";
  import ParentPicker from "./ParentPicker.svelte";
  import TagPicker from "./TagPicker.svelte";
  import CastPicker from "./CastPicker.svelte";

  /** @typedef {import('$lib/api').Collection} Collection
    * @typedef {import('$lib/api').Tag} Tag
    * @typedef {import('$lib/api').Cast} Cast
    */

  /** @typedef
    * {{
    *   entries: import('$lib/api').EntryMeta[],
    *   paging: import('$lib/api').PagingResp,
    *   casts: Cast[],
    *   tags: Tag[],
    * }} EntrySearch
    */

  /**
    * @typedef {import("axios").AxiosError} AxiosError
    * @typedef {import("axios").AxiosResponse<EntrySearch>} EntryResponse
    */

  // search parameters
  /** @type {string} */
  let sKeyword = '';
  /** @type {Collection[]} */
  let sParents = [];
  /** @type {Tag[]} */
  let sTags = [];
  /** @type {Cast[]} */
  let sCasts = [];
  // pagination
  /** @type {import('$lib/api').PagingOpts} */
  const defaultPaging = {
    desc: false,
    pageSize: 50,
    offset: 0,
    getTotal: true,
  };
  let paging = structuredClone(defaultPaging);

  const params = $page.url.searchParams
  /**
    * @param {string} param
    * @param {(s: string) => any} mapfunc
    */
  function paramToArray(param, mapfunc) {
    try {
      return params.get(param)?.split(',').map(mapfunc) || [];
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  function initParams() {
    sKeyword = params.get('keyword') || '';
    sParents = paramToArray('parents', (id) => ({ id: parseInt(id) }));
    sTags = paramToArray('tags', (id) => ({ id: parseInt(id) }));
    sCasts = paramToArray('casts', (id) => ({ id: parseInt(id) }));
  }
  $: console.log(sParents, sTags, sCasts);

  /** @param {boolean} resetPaging */
  function searchEntries(resetPaging) {
    entries = [];
    if (resetPaging) paging = structuredClone(defaultPaging);
    saxio?.post('/entry', {
      keyword: sKeyword,
      parents: sParents.map((p) => p.id),
      tagIds: sTags.map((t) => t.id),
      castIds: sCasts.map((c) => c.id),
      paging,
    }).then(/** @param {EntryResponse} res */ (res) => {
      const data = res.data;
      entries = data.entries;
      casts = data.casts;
      tags = data.tags;
      total = data.entries.length;

      // get total count from the first response only
      if (data.paging?.total !== undefined) {
        grandTotal = data.paging.total;
        paging.getTotal = false;
      }
    }).catch(/** @param {AxiosError} err */ (err) => {
      console.error(err);
    });
    
    // TODO update search params
  }

  onMount(() => {
    initParams();
    searchEntries(true)
  })

  function handleSubmit() {
    paging = defaultPaging;
    searchEntries(true);
  }

  // search results
  /** @type {import('$lib/api').EntryMeta[]} */
  let entries = [];
  /** @type {import('$lib/api').Cast[]} */
  let casts = [];
  /** @type {import('$lib/api').Tag[]} */
  let tags = [];
  // pagination
  let total = 0;
  let grandTotal = 0;

  /** @param {number} n */
  function onOffsetChange(n) {
    paging.offset = n;
    searchEntries(false);
  }

  function clearSearch() {
    sKeyword = '';
    sParents = [];
    sTags = [];
    sCasts = [];
    searchEntries(true);
  }
</script>

<form id="entryForm">
  <label for="entryKey">Keyword</label>
  <input type="text" id="entryKey" bind:value={sKeyword} />

  <ParentPicker bind:chosen={sParents} />
  <TagPicker bind:chosen={sTags} />
  <CastPicker bind:chosen={sCasts} />

  <button type="button" on:click={handleSubmit}>Search</button>
  <button type="button" on:click={clearSearch}>Clear</button>
</form>

{#if grandTotal > 0}
  <div class="entries">
    {#each entries as entry}
      <Entry {entry} />
    {/each}
  </div>

  <Paging bind:offset={paging.offset} bind:grandTotal bind:pageSize={paging.pageSize} {onOffsetChange} />
{:else}
  <p>No entries found.</p>
{/if}

<style>
  #entryForm {
    margin-bottom: 1.5rem;
  }

  .entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 0fr));
    gap: .5rem;
    justify-content: center;
  }
</style>

