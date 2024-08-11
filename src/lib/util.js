/**
  * Creates a debounced function that delays invoking the callback 
  * until after wait milliseconds have elapsed since the last time 
  * the debounced function was invoked.
  *
  * @param {Function} callback - The function to debounce.
  * @param {number} [wait=300] - The number of milliseconds to delay.
  * @returns {Function} A new debounced function.
  */
export const debounce = (callback, wait = 300) => {
  /** @type {ReturnType<typeof setTimeout>} */
  let timeout;

  return ( /** @type {any[]} */ ...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), wait);
  };
};

/** 
  * Dispatch event on click outside of node 
  *
  * @param {HTMLElement} node - The node to check if click is outside
  */
export function clickOutside(node) {
  /** @ts-ignore */
  const handleClick = event => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      node.dispatchEvent(
        /** @ts-ignore */
        new CustomEvent('click_outside', node)
      )
    }
  }

	document.addEventListener('click', handleClick, true);
  
  return {
    destroy() {
      document.removeEventListener('click', handleClick, true);
    }
	}
}

