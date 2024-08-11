<script>
  /** @type {import('$lib/api').PickerItemType} */
  export let item;
  export let onPick;
  export let focused;
</script>

<li>
  {#if focused}
    <span>★</span>
  {:else}
    <span>☆</span>
  {/if}
  <button on:click|preventDefault={() => onPick(item)}>{item.name}</button>
</li>

<style>
  li {
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding-top: .5rem;
    padding-bottom: .5rem;
  }

  li:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }

  button {
    width: 100%;
    text-align: left;
    background: none;
    border: none;
  }
</style>

