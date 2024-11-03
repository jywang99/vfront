<script>
  export let href;
  export let curPath;

  let active = false;
  $: active = curPath === href;
</script>

<a href={href}>
  {#if active}
    <span>★</span>
  {/if}
  <slot />
</a>

