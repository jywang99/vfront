<script>
  /** @type {number} */
  export let offset;
  /** @type {number} */
  export let grandTotal;
  /** @type {number} */
  export let pageSize;

  let current = offset / pageSize + 1;
  let total = Math.ceil(grandTotal / pageSize);

  let abbrevBefore = false;
  /** @type {number[]} */
  let beforePgs = [];
  $: {
    abbrevBefore = current > 5;
    beforePgs = [];
    if (abbrevBefore) {
      for (let i = current - 5; i < current; i++) {
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
    abbrevAfter = total - current > 5;
    afterPgs = [];
    if (abbrevAfter) {
      for (let i = current + 1; i <= current + 5; i++) {
        afterPgs.push(i);
      }
    } else {
      for (let i = current + 1; i <= total; i++) {
        afterPgs.push(i);
      }
    }
  }

  /** @type {(offset: number) => void} */
  export let onPageChange;
</script>

<nav aria-label="Page navigation">
  <ul class="pagination">
    <li class="page-item">
      <button class="page-link" aria-label="Previous" aria-disabled={current === 1} on:click={() => {
        current = current - 1;
        onPageChange((current - 1) * pageSize);
      }}>
        <span aria-hidden="true">&laquo;</span>
      </button>
    </li>

    {#if abbrevBefore}
      <li class="page-item">
        <button class="page-link" on:click={() => {
          current = 1;
          onPageChange(0);
        }}>1</button>
      </li>
      <li class="page-item">
        <button class="page-link">...</button>
      </li>
    {/if}

    {#each beforePgs as pg}
      <li class="page-item">
        <button class="page-link" on:click={() => {
          current = pg;
          onPageChange((pg - 1) * pageSize);
        }}>{pg}</button>
      </li>
    {/each}

    <li class="page-item">
      <button class="page-link active">{current}</button>
    </li>

    {#each afterPgs as pg}
      <li class="page-item">
        <button class="page-link" on:click={() => {
          current = pg;
          onPageChange((pg - 1) * pageSize);
        }}>{pg}</button>
      </li>
    {/each}

    {#if abbrevAfter}
      <li class="page-item">
        <button class="page-link">...</button>
      </li>
      <li class="page-item">
        <button class="page-link" on:click={() => {
          current = total;
          onPageChange((total - 1) * pageSize);
        }}>{total}</button>
      </li>
    {/if}

    <li class="page-item">
      <button class="page-link" aria-label="Next" aria-disabled={current === total} on:click={() => {
        current = current + 1;
        onPageChange(current * pageSize);
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
