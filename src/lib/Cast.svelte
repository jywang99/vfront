<script>
  import { saxio } from '$lib/api';
  import { onMount } from 'svelte';

  /** @typedef {import('$lib/api').Cast} Cast */

  /** @type {Cast} */
  export let cast;
  
  /** @type {HTMLImageElement} */
  let pic;

  onMount(() => {
    if (!cast.pic) {
      pic.src = '/missing.jpg';
      return;
    }

    saxio?.get(`/gallery/cast?path=${encodeURIComponent(cast.pic)}`, {
      responseType: 'blob',
    }).then((res) => {
      const url = URL.createObjectURL(res.data);
      pic.src = url;
    }).catch((_) => {
      console.error('Failed to load image');
      pic.src = '/missing.jpg';
    });
  })
</script>

<a href="/search/?casts={cast.id}">
  <p>{cast.name}</p>
  <img bind:this={pic} alt={cast.name} />
</a>

<style>
  a {
    display: inline-block;
    position: relative;
    width: 100px;
    height: 150px;
  }

  p {
    position: absolute;
    bottom: 0;
    left: 0;
    padding-left: 0.5rem;
    color: white;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  }

  img {
    width: 100%;
    height: auto;
  }
</style>

