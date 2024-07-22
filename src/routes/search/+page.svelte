<script>
  import { saxio } from "$lib/api";
  import { onMount } from "svelte";
  import Entry from "./Entry.svelte";
  import Paging from "./Paging.svelte";

  /** @typedef
    * {{
    *   entries: import('$lib/api').EntryMeta[],
    *   paging: import('$lib/api').PagingResp,
    *   casts: import('$lib/api').Cast[],
    *   tags: import('$lib/api').Tag[],
    * }} EntrySearch
    */

  /**
    * @typedef {import("axios").AxiosError} AxiosError
    * @typedef {import("axios").AxiosResponse<EntrySearch>} EntryResponse
    */

  // search form
  /** @type {string} */
  let keyword = '';
  /** @type {number[]} */
  let parents = [];
  /** @type {number[]} */
  let tagIds = [];
  /** @type {number[]} */
  let castIds = [];

  // pagination
  /** @type {import('$lib/api').PagingOpts} */
  const defaultPaging = {
    desc: false,
    pageSize: 50,
    offset: 0,
    getTotal: true,
  };
  let paging = defaultPaging;

  // search results
  /** @type {import('$lib/api').EntryMeta[]} */
  let entries = [];
  /** @type {import('$lib/api').Cast[]} */
  let casts = [];
  /** @type {import('$lib/api').Tag[]} */
  let tags = [];
  /** @type {number} */
  let total = 0;
  /** @type {number} */
  let grandTotal = 0;
  let pageSize = paging.pageSize;
  let offset = paging.offset;

  /** @param {boolean} resetPaging */
  function searchEntries(resetPaging) {
    entries = [];
    if (resetPaging) paging = defaultPaging;
    saxio?.post('/entry', {
      keyword,
      parents,
      tagIds,
      castIds,
      paging,
    }).then(/** @param {EntryResponse} res */ (res) => {
      const data = res.data;
      entries = data.entries;
      casts = data.casts;
      tags = data.tags;
      total = data.entries.length;
      grandTotal = data.paging.total;
    }).catch(/** @param {AxiosError} err */ (err) => {
      console.error(err);
    });
  }

  onMount(() => searchEntries(true))

  /** @param {SubmitEvent} event */
  function handleSubmit(event) {
    event.preventDefault();
    paging = defaultPaging;
    searchEntries(true);
  }
</script>

<form on:submit={handleSubmit}>
  <label for="entryKey">Keyword</label>
  <input type="text" id="entryKey" bind:value={keyword} />

  <label for="parents">Parents</label>
  <input type="text" id="parents" bind:value={parents} />

  <label for="tagIds">Tag IDs</label>
  <input type="text" id="tagIds" bind:value={tagIds} />

  <label for="castIds">Cast IDs</label>
  <input type="text" id="castIds" bind:value={castIds} />

  <button type="submit">Submit</button>
</form>

{#each entries as entry}
  <Entry {entry} />
{/each}

{#if grandTotal > 0}
  <Paging {offset} {grandTotal} {pageSize} onPageChange={(n) => {
    paging.offset = n;
    searchEntries(false);
  }} />
{/if}

