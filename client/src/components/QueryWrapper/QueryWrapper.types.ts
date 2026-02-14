import type { UseQueryResult } from '@tanstack/react-query'

export type QueryWrapperProps<TData> = {
  query: UseQueryResult<TData>
  /** Message or element shown while loading. Default: "Loading…" */
  loadingMessage?: React.ReactNode
  /** Message or element shown when there is no data. Default: "No data." */
  noDataMessage?: React.ReactNode
  /** Message or element shown on error. Default: "Error: {error.message}" */
  errorMessage?: (error: Error) => React.ReactNode
  children: (data: TData) => React.ReactNode
}
