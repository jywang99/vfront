<script>
  import { debounce } from "$lib/util";
  import PickerItem from "./PickerItem.svelte";
  import PickerList from "./PickerList.svelte";

  /** @typedef {import('$lib/api').PickerItemType} PickerItemType */

  /** @type {string} */
  export let title;
  /** @type {string} */
  export let id;

  /** @type {PickerItemType[]} */
  export let fullList;
  /** @type {PickerItemType[]} */
  export let chosen;
  export let fullLoading = false;
  export let chosenLoading = false;

  /** @type {string} */
  export let keyword;

  /** @type {() => void} */
  export let handleInput;
  const dHandleInput = debounce(handleInput, 300);

  let inputFocused = false;
  let dropFocused = false;

  // initialization
  export let initFunc;
  let initialized = false;
  $: if (inputFocused && !initialized) {
    initialized = true;
    initFunc();
  }

  /** @type {PickerItemType[]} */
  let choosable;
  $: if (chosen && chosen.length > 0) {
    choosable = fullList.filter((item) => !chosen.some((c) => c.id === item.id));
  } else {
    choosable = fullList;
  }

  /** @param {PickerItemType} item */
  function onChoose(item) {
    chosen = [...chosen, item];
  }

  /** @param {PickerItem} item */
  function onUnchoose(item) {
    chosen = chosen.filter((c) => c.id !== item.id);
  }

  let lFocus = false, rFocus = false, iFocus = true;
  /** @param {KeyboardEvent} e */
  function onKeyDown(e) {
     switch(e.key) {
       case 'ArrowDown':
         if (iFocus) { // from input to left list
           lFocus = true;
           iFocus = false;
           e.preventDefault();
         }
         break;
       case 'ArrowRight':
         if (lFocus) { // from left list to right list
           rFocus = true;
           lFocus = false;
           e.preventDefault();
         }
         break;
       case 'ArrowLeft':
         if (rFocus) { // from right list to left list
           lFocus = true;
           rFocus = false;
           e.preventDefault();
         }
         break;
       default:
         break;
     }
  }
  // restore focus to input
  $: if (!lFocus && !rFocus && !iFocus) {
    iFocus = true;
  }
  $: console.log({lFocus, rFocus, iFocus});
</script>

<div class="container">
  <label for={id}>{title}</label>
  <div class="input-wrap">
    <!-- input -->
    <input type="text" {id} bind:value={keyword} on:input={() => dHandleInput()} on:keydown={onKeyDown}
      on:focusin={() => inputFocused = true} on:focusout={() => inputFocused = false} />

    <!-- dialog -->
    {#if inputFocused || dropFocused}
      <div class="dialog" on:mouseenter={() => dropFocused = true} on:mouseleave={() => dropFocused = false} role="dialog" >
        {#if fullLoading}
          <div class="loading">Loading...</div>
        {:else}
          <PickerList title="Choose from" bind:itemList={choosable} onPick={onChoose} focused={lFocus} />
        {/if}

        {#if chosenLoading}
          <div class="loading">Loading...</div>
        {:else}
          <PickerList title="Chosen" bind:itemList={chosen} onPick={onUnchoose} focused={rFocus} canClear />
        {/if}
      </div>
    {/if}

    <!-- badge -->
    {#if chosen && chosen.length > 0}
      <span class="badge">{chosen.length}</span>
    {/if}
  </div>
</div>

<style>
  @import './picker.css';
</style>

