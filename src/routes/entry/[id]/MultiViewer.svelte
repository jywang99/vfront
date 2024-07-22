<script>
import Paging from "$lib/Paging.svelte";
import Viewer from "./Viewer.svelte";

  /** @type {number} */
  export let entryId;
  /** @type {string[]} */
  export let files;

  let pageSize = 10;
  let offset = 0;

  $: renderFiles = files.slice(offset, offset + pageSize);

  /** @type {HTMLElement} */
  let topPaging;
  /** @param {number} ofs */
  function onOffsetChange(ofs) {
    offset = ofs;
    topPaging.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<div bind:this={topPaging} />
<Paging grandTotal={files.length} bind:offset bind:pageSize {onOffsetChange}/>
{#each renderFiles as file}
  <Viewer {entryId} filename={file} param />
{/each}
<Paging grandTotal={files.length} bind:offset bind:pageSize {onOffsetChange} />

