<script>
  import { env } from '$env/dynamic/public'

  export let entryId;
  export let filename;
  export let param = false;

  // TODO refine
  $: type = filename.split('.').pop();
  $: src = `${env.PUBLIC_API_URL}/media/${type === 'mp4' || type === 'webm' ? 'stream' : 'static'}/${entryId}${param ? '?file=' + filename : ''}`;
</script>

<div class="container">
  {#if type === 'mp4' || type === 'webm'}
    <video controls>
      <track kind="captions" />
      <source src={src} />
    </video>
  {:else}
    <img src={src} alt={filename} />
  {/if}
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img, video {
    max-width: 100%;
    max-height: 100vh;
  }
</style>

