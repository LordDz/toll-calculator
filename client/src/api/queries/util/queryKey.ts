/** Build query key array for TanStack Query (key + optional params). */
export function getQueryKey(baseKey: string, ...params: (string | number | undefined)[]): string[] {
  return [baseKey, ...params.filter((p): p is string | number => p !== undefined).map(String)]
}
