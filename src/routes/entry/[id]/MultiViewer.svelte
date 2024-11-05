<script>
import Paging from "$lib/Paging.svelte";
import Viewer from "./Viewer.svelte";

  /** @type {number} */
  export let entryId;
  /** @type {string[]} */
  export let files;

  let paging = {
    desc: false,
    pageSize: 10,
    offset: 0,
    getTotal: false,
  };

  /** @type {HTMLElement} */
  let topPaging;

  $: renderFiles = files.slice(paging.offset, paging.offset + paging.pageSize);
  $: paging.offset && topPaging.scrollIntoView();
</script>

<div bind:this={topPaging} />
<Paging grandTotal={files.length} bind:paging />
{#each renderFiles as file}
  <Viewer {entryId} filename={file} param />
{/each}
<Paging grandTotal={files.length} bind:paging />

