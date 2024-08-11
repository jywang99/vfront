<script>
  import PickerItem from "./PickerItem.svelte";

  export let title;
  /** @type {import('$lib/api').PickerItemType[]} */
  export let itemList;
  /** @type {(item: import('$lib/api').PickerItemType) => void} */
  export let onPick;
  export let canClear = false;

  export let focused = false;
  /** @type {() => void} */
  export let switchSide;

  let focusIdx = 0;
  /** @type {HTMLDivElement} */
  let picker;
  $: if (focused && picker) picker.focus();

  /** @param {KeyboardEvent} e */
  function handleKeyDown(e) {
     switch(e.key) {
       case 'i':
       case 'Escape':
         focused = false;
         break;
       case 'k':
       case 'ArrowUp':
         if (focusIdx > 0) {
           focusIdx--;
         } else {
           focusIdx = itemList.length - 1;
         }
         break;
       case 'j':
       case 'ArrowDown':
         if (focusIdx < itemList.length - 1) {
           focusIdx++;
         } else {
           focusIdx = 0;
         }
         break;
       case 'l':
       case 'h':
       case 'ArrowRight':
       case 'ArrowLeft':
         switchSide();
         break;
       case 'Enter':
         onPick(itemList[focusIdx]);
         break;
       case 'c':
         if (canClear) itemList = [];
         break;
       case 'Tab':
         break;
       default:
         return;
     }

     // only for the handled keys
     e.preventDefault();
  }
</script>

<div class="container" class:focused={focused} role="textbox" tabindex="0" on:keydown={handleKeyDown} bind:this={picker}>
  <h3>{title}</h3>
  <ul>
    {#each itemList as item, idx}
      <PickerItem {item} {onPick} focused={focusIdx === idx} />
    {/each}
  </ul>
  {#if canClear}
    <button class="trash" on:click|preventDefault={() => itemList = []}>
      <img src="/trash.svg" alt="trash" />
    </button>
  {/if}
</div>

<style>
  .container {
    padding: .5rem;
  }

  h3 {
    margin-bottom: .5rem;
    margin-top: .5rem;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  .trash {
      cursor: pointer;
      position: absolute;
      top: .5em;
      right: .5em;
  }

  .trash img {
      width: 1rem;
      height: 1rem;
  }
</style>

