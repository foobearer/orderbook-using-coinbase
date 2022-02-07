export function sortArray(array, property) {
  if (array) {
    const comparison = (a, b) => a[property].localeCompare(b, 'en', { numeric: true });
    return array.sort(comparison);
  }
}