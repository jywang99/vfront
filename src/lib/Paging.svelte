<script>
  /** @type {number} */
  export let offset;
  /** @type {number} */
  export let grandTotal;
  /** @type {number} */
  export let pageSize;
  export let radius = 4;

  /** @type {number} */
  let current; // 1-based
  /** @type {number} */
  let total;
  $: {
    current = offset / pageSize + 1;
    total = Math.ceil(grandTotal / pageSize);
  }

  let abbrevBefore = false;
  /** @type {number[]} */
  let beforePgs = [];
  $: {
    abbrevBefore = current > radius + 2;
    beforePgs = [];
    if (abbrevBefore) {
      for (let i = current - radius; i < current; i++) {
        beforePgs.push(i);
      }
    } else {
      for (let i = 1; i < current; i++) {
        beforePgs.push(i);
      }
    }
  }

  let abbrevAfter = false;
  /** @type {number[]} */
  let afterPgs = [];
  $: {
    abbrevAfter = total - current > radius + 1;
    afterPgs = [];
    if (abbrevAfter) {
      for (let i = current + 1; i <= current + radius; i++) {
        afterPgs.push(i);
      }
    } else {
      for (let i = current + 1; i <= total; i++) {
        afterPgs.push(i);
      }
    }
  }

  /** @type {(offset: number) => void} */
  export let onOffsetChange;
  /** @param {number} pg */
  function onPageChange(pg) {
    onOffsetChange((pg - 1) * pageSize);
  }
</script>

<ul class="pagination">
  <li class="page-item">
    <button class="page-link" aria-label="Previous" disabled={current === 1} on:click={() => {
      onPageChange(current - 1);
    }}>
      <span aria-hidden="true">&laquo;</span>
    </button>
  </li>

  {#if abbrevBefore}
    <li class="page-item">
      <button class="page-link" on:click={() => {
        onPageChange(1);
      }}>1</button>
    </li>
    <li class="page-item">
      <button class="page-link">...</button>
    </li>
  {/if}

  {#each beforePgs as pg}
    <li class="page-item">
      <button class="page-link" on:click={() => {
        onPageChange(pg);
      }}>{pg}</button>
    </li>
  {/each}

  <li class="page-item">
    <button class="page-link active">{current}</button>
  </li>

  {#each afterPgs as pg}
    <li class="page-item">
      <button class="page-link" on:click={() => {
        onPageChange(pg);
      }}>{pg}</button>
    </li>
  {/each}

  {#if abbrevAfter}
    <li class="page-item">
      <button class="page-link">...</button>
    </li>
    <li class="page-item">
      <button class="page-link" on:click={() => {
        onPageChange(total);
      }}>{total}</button>
    </li>
  {/if}

  <li class="page-item">
    <button class="page-link" aria-label="Next" disabled={current === total} on:click={() => {
      onPageChange(current + 1);
    }}>
      <span aria-hidden="true">&raquo;</span>
    </button>
  </li>
</ul>

<style>
  .pagination {
    display: flex;
    justify-content: center;
  }

  .page-item {
    display: inline-block;
  }

  .page-link {
    text-decoration: none;
    color: black;
  }

  .active {
    font-weight: bold;
    background-color: lightgrey;
  }

  button {
    background: none;
    cursor: pointer;
    border: 1px solid grey;
    padding: .5rem;
  }
</style>
