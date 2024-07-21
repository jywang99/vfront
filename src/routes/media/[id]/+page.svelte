<script>
  import { saxio } from "$lib/api";
  import { onMount } from 'svelte';
  import { PUBLIC_API_URL } from "$env/static/public";

  /** @type 
   * {{ meta: { id: number, name: string, desc: string, casts: number[], tags: number[], parentId: number, thumbStatic: string, thumbDynamic: string[], created: string, updated: string, aired: string }, path: string, files: string[] } | null}
   */
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
    })
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
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
  <p>Parent: {data.meta.parentId}</p>

  {#if data.meta.tags != null}
    <p>Tags: {data.meta.tags.join(', ')}</p>
  {/if}
  {#if data.meta.casts != null}
    <p>Casts: {data.meta.casts.join(', ')}</p>
  {/if}

  {#if data.files}
  <ul>
    {#each data.files as file}
      <li><a href={file}>{file}</a></li>
    {/each}
  </ul>
  {/if}

  <video controls>
    <track kind="captions" />
    <source src={`${PUBLIC_API_URL}/media/partial`} type="video/mp4" />
  </video>
{/if}

