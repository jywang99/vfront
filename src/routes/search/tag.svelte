<script>
  /** @typedef {import('$lib/api').Tag} Tag */

  /** @type {Tag} */
  export let tag;
</script>

<a href="/search/?tags={tag.id}">
  <span>{tag.name}</span>
</a>

<style>
  a {
    display: inline-block;
    padding: 0.5rem;
    margin: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    text-decoration: none;
    color: black;
  }
</style>
