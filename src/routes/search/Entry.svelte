<script>
  import { saxio } from '$lib/api';
  import { onMount } from 'svelte';

  /** @type {import('$lib/api').EntryMeta} */
  export let entry;

  /** @type {HTMLImageElement} */
  let staticThumb;
  /** @type {HTMLImageElement} */
  let dynamicThumb;
  /** @type {string[]} */
  let dynamicUrls = [];

  let staticReady = false;
  let dynamic = false;
  let dynamicReady = false;

  onMount(() => {
    saxio?.get(`/gallery/thumb?path=${encodeURIComponent(entry.thumbStatic)}`, {
      responseType: 'blob',
    }).then((res) => {
      const url = URL.createObjectURL(res.data);
      staticThumb.src = url;
      staticReady = true;
    }).catch((err) => {
      console.error(err);
    });
  })

  $: if (dynamic && !dynamicReady) {
    entry.thumbDynamic.forEach((path) => {
      saxio?.get(`/gallery/thumb?path=${encodeURIComponent(path)}`, {
        responseType: 'blob',
      }).then((res) => {
        const url = URL.createObjectURL(res.data);
        dynamicUrls.push(url);
        if (dynamicUrls.length === entry.thumbDynamic.length) {
          dynamicThumb.src = dynamicUrls[0];
          dynamicReady = true;
        }
      }).catch((err) => {
        console.error(err);
      });
    });
  }
</script>

<a class="entry" href={`/entry/${entry.id}`}>
  <div class="thumbWrap" on:mouseenter={() => dynamic = true} on:mouseleave={() => dynamic = false} role="region" aria-label="Hoverable region">
    <img bind:this={staticThumb} class:hidden={dynamic && dynamicReady || !staticReady} alt="thumbStatic" />
    <img bind:this={dynamicThumb} class:hidden={!dynamic || !dynamicReady} alt="thumbDynamic" />
  </div>
  <p>{entry.name}</p>
  {#if entry.desc}
    <p>{entry.desc}</p>
  {/if}
</a>

<style>
  .entry {
    text-decoration: none;
    color: black;
    max-width: 180px;
  }

  .entry p {
    margin: 0;
    overflow: hidden;
    font-weight: bold;
    height: 2em;
    line-height: 1rem;
  }

  .thumbWrap {
    height: 135px;
    width: 180px;
    background-color: black;
    display: flex;
    justify-content: center;
  }

  .thumbWrap img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }

  .hidden {
    display: none;
  }
</style>

