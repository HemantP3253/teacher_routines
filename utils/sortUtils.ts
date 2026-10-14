import { sortType } from "@/interfaces/interfaces";

/**
 * Sorts any type of array using the label
 *
 * Uses the getLabel function to get the name of the array, and sorts by using it as the key value.
 *
 * @param data - Array of data of any (general) type
 * @param getLabel - Function to get label from the data
 * @param sortType - Type of sort required, "acending", "descending", or undefined (for no sorting)
 * @returns Array sorted using the sortType and label
 */
export function sortByLabel<T>(
  data: readonly T[],
  getLabel: (item: T) => string,
  sortType?: sortType,
): readonly T[] {
  if (!sortType) return data;

  return [...data].sort((a, b) => {
    const sorted = getLabel(a).localeCompare(getLabel(b));
    return sortType === "ascending" ? sorted : -sorted;
  });
}
