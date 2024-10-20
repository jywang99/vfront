<script>
  import { saxio } from "$lib/api";
  import { onMount } from 'svelte';
  import MultiViewer from "./MultiViewer.svelte";
  import Viewer from "./Viewer.svelte";
  import Tag from "$lib/Tag.svelte";
  import Cast from "$lib/Cast.svelte";
  import Collection from "$lib/Collection.svelte";

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
  <h1>{data.meta.name}</h1>
  <p>{data.meta.desc}</p>
  <p>Created: {data.meta.created}</p>
  <p>Updated: {data.meta.updated}</p>
  <p>Aired: {data.meta.aired}</p>
  <p>Parent: <Collection collection={data.parent} /></p>

  {#if data.files}
    <MultiViewer entryId={data.meta.id} files={data.files} />
  {:else}
    <Viewer entryId={data.meta.id} filename={data.path} />
  {/if}

  <div>
    {#if data.tags != null}
      {#each data.tags as tag}
        <Tag {tag} />
      {/each}
    {/if}
  </div>
  <div>
    {#if data.meta.casts != null}
      {#each data.casts as cast}
        <Cast {cast} />
      {/each}
    {/if}
  </div>
{:else}
  <p>Loading...</p>
{/if}

