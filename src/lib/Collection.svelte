<script>
  /** @type {import('$lib/api').Collection} */
  export let collection;
</script>

<a href="/search/?parents={collection.id}">
  <span>{collection.name}</span>
</a>

