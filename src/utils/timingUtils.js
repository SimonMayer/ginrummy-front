/**
 * Returns a debounced version of the provided callback function.
 * The callback will only be executed after the specified delay in milliseconds.
 *
 * @param {Function} callback - The function to debounce.
 * @param {number} delayMilliseconds - The number of milliseconds to delay.
 * @returns {Function} A debounced version of the callback.
 */
export const debounce = (callback, delayMilliseconds) => {
    let timeout;
    return function (...args) {
        const later = () => {
            clearTimeout(timeout);
            callback(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, delayMilliseconds);
    };
};
