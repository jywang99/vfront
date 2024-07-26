<script>
  /** @type {import('$lib/api').PickerItemType} */
  export let item;
  export let onPick;
  export let focus;
</script>

<li>
  <button on:click|preventDefault={() => onPick(item)}>{item.name}</button>
  {#if focus}
    <span>focused!!</span>
  {/if}
</li>

