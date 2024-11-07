<script>
  import { saxio } from '$lib/api';
    import Cast from './Cast.svelte';
    import Tag from './Tag.svelte';

  /** @type {import('$lib/api').EntryJoined} */
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

  $: if (entry.thumbStatic) {
    saxio?.get(`/gallery/thumb?path=${encodeURIComponent(entry.thumbStatic)}`, {
      responseType: 'blob',
    }).then((res) => {
      const url = URL.createObjectURL(res.data);
      staticThumb.src = url;
      staticReady = true;
    }).catch((err) => {
      console.error(err);
    });
  }

  const loadDynamicThumb = () => {
    if (!dynamic || dynamicReady || !entry.thumbDynamic) {
      return;
    }

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

  $: if (entry.thumbDynamic) {
    dynamicReady = false;
    dynamicUrls = [];
    loadDynamicThumb();
  }
  $: if (dynamic) loadDynamicThumb();

  let tagHover = false;
  let castHover = false;

  const handleMouseLeave = () => {
    dynamic = false;
    tagHover = false;
    castHover = false;
  }
</script>

<a class="entry" href={`/entry/${entry.id}`}>
  <div class="thumbWrap" on:mouseenter={() => dynamic = true} on:mouseleave={handleMouseLeave} role="region" aria-label="Hoverable region">
    <img bind:this={staticThumb} class:hidden={dynamic && dynamicReady || !staticReady} alt="thumbStatic" src='/missing.jpg' />
    <img bind:this={dynamicThumb} class:hidden={!dynamic || !dynamicReady} alt="thumbDynamic" />
    <div class="hover-icon tag-icon" on:mouseenter={() => {
      tagHover = true;
      castHover = false;
    }} role="tooltip">T</div>
    <div class="hover-icon cast-icon" on:mouseenter={() => {
      castHover = true;
      tagHover = false;
    }} role="tooltip">C</div>
    {#if tagHover}
      <div class="hover-menu">
        {#each entry.tags as tag}
          <Tag {tag} />
        {/each}
      </div>
    {/if}
    {#if castHover}
      <div class="hover-menu">
        {#each entry.casts as cast}
          <Cast {cast} />
        {/each}
      </div>
    {/if}
  </div>
  <p>{entry.name}</p>
</a>

<style>
  .entry {
    text-decoration: none;
    color: black;
    max-width: 180px;
    position: relative;
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

  .hover-icon {
    position: absolute;
    font-size: 2rem;
    color: orange;
    width: 2rem;
    height: 2rem;
    text-align: center;
    line-height: 2rem;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid orange;
  }

  .tag-icon {
    top: 4px;
    left: 4px;
  }

  .cast-icon {
    top: 4px;
    right: 4px;
  }

  .hover-menu {
    position: absolute;
    display: flex;
    background-color: white;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

