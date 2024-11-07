<script>
  import Entry from "$lib/Entry.svelte";

  /** @type {import('$lib/api').EntryMeta[]} */
  export let entries;
  /** @type {import('$lib/api').Tag[]} */
  export let tags;
  /** @type {import('$lib/api').Cast[]} */
  export let casts;

  /** @type {import('$lib/api').EntryJoined[]} */
  let jentries = [];
  const convert = () => {
    /** @type {import('$lib/api').EntryJoined[]} */
    const converted = [];
    entries.forEach((entry) => {
      if (!entry.tags) entry.tags = [];
      if (!entry.casts) entry.casts = [];
      const jentry = {
        ...entry,
        tags: tags.filter((tag) => entry.tags.includes(tag.id)),
        casts: casts.filter((cast) => entry.casts.includes(cast.id)),
      };
      converted.push(jentry);
    });
    jentries = converted;
  }
  $: entries.length && convert();
</script>

<div class="entries section">
  {#if jentries.length === 0}
    <p>No entries found</p>
  {:else}
    {#each jentries as entry}
      <Entry {entry} />
    {/each}
  {/if}
</div>

<style>
  .entries {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 0fr));
    gap: .5rem;
    justify-content: center;
  }
</style>

