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

