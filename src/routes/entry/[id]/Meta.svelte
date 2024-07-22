<script>
  /** @type {import('$lib/api').EntryMeta} */
  export let meta;
</script>

<h1>{meta.name}</h1>
<p>{meta.desc}</p>
<p>Created: {meta.created}</p>
<p>Updated: {meta.updated}</p>
<p>Aired: {meta.aired}</p>
<p>Parent: {meta.parentId}</p>

{#if meta.tags != null}
  <p>Tags: {meta.tags.join(', ')}</p>
{/if}
{#if meta.casts != null}
  <p>Casts: {meta.casts.join(', ')}</p>
{/if}

