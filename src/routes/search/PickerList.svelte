<script>
  import PickerItem from "./PickerItem.svelte";

  export let title;
  /** @type {PickerItem[]} */
  export let itemList;
  export let onPick;
  export let focused;
  export let canClear = false;

  let focusIdx = 0;
</script>

<div>
  <h3>{title}</h3>
  {#if focused}
    <span>focused!!</span>
  {/if}
  <ul>
    {#each itemList as item, idx}
      <PickerItem {item} onPick={onPick} focus={focusIdx === idx} />
    {/each}
  </ul>
  {#if canClear}
    <button class="trash" on:click|preventDefault={() => itemList = []}>
      <img src="/trash.svg" alt="trash" />
    </button>
  {/if}
</div>

