<script>
  import { debounce } from "$lib/util";
  import PickerList from "./PickerList.svelte";
  import {clickOutside} from '$lib/util';

  /** @typedef {import('$lib/api').PickerItemType} PickerItemType */

  /** @type {string} */
  export let title;
  /** @type {string} */
  export let id;

  /** @type {string} */
  export let keyword;
  /** @type {PickerItemType[]} */
  export let fullList;
  /** @type {PickerItemType[]} */
  export let chosen;
  export let fullLoading = false;
  export let chosenLoading = false;

  /** @type {() => void} */
  export let handleInput;
  const dHandleInput = debounce(handleInput, 300);

  let focused = false;
  let inputFocused = false;

  // initialization
  export let initFunc;
  let initialized = false;
  $: if (inputFocused && !initialized) {
    initialized = true;
    initFunc();
  }

  /** @type {() => void} */
  export let submit;

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

  /** @param {PickerItemType} item */
  function onUnchoose(item) {
    chosen = chosen.filter((c) => c.id !== item.id);
  }

  let lFocus = false, rFocus = false, iFocus = true;
  /** @type {HTMLInputElement} */
  let inputEle;
  // restore focus to input
  $: if (!lFocus && !rFocus && !iFocus) {
    iFocus = true;
    inputEle.focus();
  }

  function unfocus() {
    focused = false;
    lFocus = false;
    rFocus = false;
  }

  /** @param {KeyboardEvent} e */
  function onKeyDown(e) {
    // only allow typing when input is focused
    if (!iFocus) e.preventDefault();
    focused = true;

    switch(e.key) {
      case 'Enter':
        if (e.ctrlKey) {
          submit();
          break;
        }
      case 'ArrowDown':
        if (iFocus) {
          lFocus = true;
          iFocus = false;
        }
        break;
      case 'Tab':
      case 'Escape':
        // release focus from this component
        unfocus();
        break;
      default:
        break;
    }
  }

  function switchSide() {
    lFocus = !lFocus;
    rFocus = !rFocus;
  }
</script>

<div class="container">
  <label for={id}>{title}</label>
  <div class="input-wrap" use:clickOutside on:click_outside={unfocus}>
    <!-- input -->
    <input type="text" {id} autocomplete="off"
      bind:this={inputEle}
      bind:value={keyword} 
      on:input={() => dHandleInput()} on:keydown={onKeyDown}
      on:focusin={() => { inputFocused = true; focused = true }}
      on:focusout={() => inputFocused = false} />

    <!-- dialog -->
    {#if focused}
      <div class="dialog" role="dialog" >
        {#if fullLoading}
          <div class="loading">Loading...</div>
        {:else}
          <PickerList title="Choose from" bind:itemList={choosable} onPick={onChoose} bind:focused={lFocus} {switchSide} />
        {/if}

        {#if chosenLoading}
          <div class="loading">Loading...</div>
        {:else}
          <PickerList title="Chosen" bind:itemList={chosen} onPick={onUnchoose} bind:focused={rFocus} canClear {switchSide} />
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
  .container {
    display: inline-block;
    position: relative;
  }

  .input-wrap {
    position: relative;
    display: inline-block;
  }

  .badge {
    position: absolute;
    top: 50%;
    right: 0.3rem;
    transform: translateY(-50%);
    background-color: grey;
    color: white;
    border-radius: 50%;
    width: 1.3rem;
    height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .dialog {
    position: absolute;
    background-color: white;
    border: 1px solid black;
    display: flex;
    flex-direction: row;
  }

  .dialog > div {
    min-width: 10rem;
  }
</style>

