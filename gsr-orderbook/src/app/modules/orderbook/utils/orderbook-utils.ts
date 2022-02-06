export function sortArray(array) {
  if (array) {
    return array.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }
}