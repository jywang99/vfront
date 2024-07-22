<script>
  import { saxio } from "$lib/api";
  import { onMount } from 'svelte';
  import Meta from "./Meta.svelte";
  import MultiViewer from "./MultiViewer.svelte";
  import Viewer from "./Viewer.svelte";

  /** @type {import('$lib/api').Entry | null } */
  let data = null;

  /**
   * @param id {number}
   */
  function fetchData(id) {
    if (id < 0) {
      window.location.href = '/';
      return;
    }

    // @ts-ignore
    saxio.get(`/entry/${id}`, {
      withCredentials: true,
    }).then((res) => {
        data = res.data;
    }).catch((err) => {
      console.error(err);
      window.location.href = '/';
    });
  }

  onMount(() => {
    try {
      const url = window.location.pathname;
      const parts = url.split('/');
      const id = parseInt(parts[parts.length - 2]);
      fetchData(id);
    } catch (err) {
      console.error(err);
      window.location.href = '/';
    }
  });
</script>

{#if data !== null}
  <Meta meta={data.meta} />
  
  {#if data.files}
    <MultiViewer entryId={data.meta.id} files={data.files} />
  {:else}
    <Viewer entryId={data.meta.id} filename={data.path} />
  {/if}
{:else}
  <p>Loading...</p>
{/if}

