<script>
  /** @type {number} */
  export let offset;
  /** @type {number} */
  export let grandTotal;
  /** @type {number} */
  export let pageSize;

  const RADIUS = 4;

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
    abbrevBefore = current > RADIUS + 2;
    beforePgs = [];
    if (abbrevBefore) {
      for (let i = current - RADIUS; i < current; i++) {
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
    abbrevAfter = total - current > RADIUS + 1;
    afterPgs = [];
    if (abbrevAfter) {
      for (let i = current + 1; i <= current + RADIUS; i++) {
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

<nav aria-label="Page navigation">
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
</nav>

<style>
  .pagination {
    display: flex;
    justify-content: center;
  }

  .page-item {
    display: inline-block;
    margin: 0.5rem;
  }

  .page-link {
    text-decoration: none;
    color: black;
  }

  .active {
    font-weight: bold;
  }
</style>
