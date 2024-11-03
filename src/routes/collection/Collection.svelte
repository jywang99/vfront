<script>
  import { saxio } from '$lib/api';
  import Collection from '$lib/Collection.svelte';
  import EntryWall from '$lib/EntryWall.svelte';

  /** @type {import('$lib/api').Collection} */
  export let collection;

  /** @type {import('$lib/api').EntryMeta[]} */
  let entries = [];
  const getEntries = () => {
    saxio?.post('/entry', {
      parents: [collection.id],
      paging: {
        desc: true,
        pageSize: 5,
        offset: 0,
      }
    }).then(res => {
      entries = res.data.entries;
    }).catch((err) => {
      console.error(err);
    });
  };
  getEntries();
</script>

<div class="collection">
  <div>
    <h2><Collection {collection} /></h2>
    <p>{collection.desc}</p>
    <p>Created at: {collection.created}</p>
  </div>
  <div>
    <EntryWall {entries} />
  </div>
</div>

<style>
  .collection {
    margin: 1rem;
  }
</style>

