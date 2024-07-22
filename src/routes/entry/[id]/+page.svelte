<script>
  import { saxio } from "$lib/api";
  import { onMount } from 'svelte';
  import { PUBLIC_API_URL } from "$env/static/public";
  import Meta from "./Meta.svelte";

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
    <ul>
      {#each data.files as file}
        <li><a href={file}>{file}</a></li>
      {/each}
    </ul>
  {:else}
    <video controls>
      <track kind="captions" />
      <source src={`${PUBLIC_API_URL}/media/stream/${data.meta.id}`} type="video/mp4" />
    </video>
  {/if}
{:else}
  <p>Loading...</p>
{/if}

