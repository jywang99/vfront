<script>
  import Entry from "$lib/Entry.svelte";

  /** @typedef {import('$lib/api').EntryMeta} EntryMeta */
  /** @type {EntryMeta[]} */
  export let entries;
</script>

<div class="entries section">
  {#each entries as entry}
    <Entry {entry} />
  {/each}
</div>

<style>
  .entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 0fr));
    gap: .5rem;
    justify-content: center;
  }
</style>

