<script>
  import { saxio } from "$lib/api";
  import { onMount } from "svelte";
  import Entry from "./Entry.svelte";
  import Paging from "$lib/Paging.svelte";
  import ParentPicker from "./ParentPicker.svelte";

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

  // search parameters
  /** @type {string} */
  let keyword = '';
  /** @type {import('$lib/api').Collection[]} */
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
  let paging = structuredClone(defaultPaging);

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

  /** @param {boolean} resetPaging */
  function searchEntries(resetPaging) {
    entries = [];
    if (resetPaging) paging = structuredClone(defaultPaging);
    saxio?.post('/entry', {
      keyword,
      parents: parents.map((p) => p.id),
      tagIds,
      castIds,
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
  }

  onMount(() => searchEntries(true))

  /** @param {SubmitEvent} event */
  function handleSubmit(event) {
    event.preventDefault();
    paging = defaultPaging;
    searchEntries(true);
  }

  /** @param {number} n */
  function onOffsetChange(n) {
    paging.offset = n;
    searchEntries(false);
  }
</script>

<form id="entryForm" on:submit={handleSubmit}>
  <label for="entryKey">Keyword</label>
  <input type="text" id="entryKey" bind:value={keyword} />

  <ParentPicker bind:chosen={parents} />

  <label for="tagIds">Tag IDs</label>
  <input type="text" id="tagIds" bind:value={tagIds} />

  <label for="castIds">Cast IDs</label>
  <input type="text" id="castIds" bind:value={castIds} />

  <button type="submit">Submit</button>
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

