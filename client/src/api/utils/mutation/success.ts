import type { QueryKey } from '@tanstack/react-query'
import { queryClient } from '@/api/queryClient/queryClient'

/**
 * On mutation success: append a new item to an existing list query in the cache.
 * If the query has no data yet, the new item becomes the only entry.
 * If `compare` is provided, the list is kept sorted (e.g. by date) after adding the item.
 */
export function appendToQueryOnSuccess<T>(
  queryKey: QueryKey,
  newItem: T,
  compare?: (a: T, b: T) => number,
): void {
  queryClient.setQueryData<T[]>(queryKey, (prev) => {
    const next = prev ? [...prev, newItem] : [newItem]
    return compare ? [...next].sort(compare) : next
  })
}
