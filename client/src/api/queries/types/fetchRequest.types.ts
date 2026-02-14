import type { QueryState, UseQueryOptions } from '@tanstack/react-query'

type RefetchOnMount = boolean | 'always'
type QueryOptions<T> = UseQueryOptions<T, Error, T, string[]>

export interface QueryGet<T> {
  queryKey: string
  get: (
    enabled?: boolean,
    refetchOnMount?: RefetchOnMount,
  ) => QueryOptions<T>
  stateGet?: () => QueryState<T, Error> | undefined
}

export interface QueryGetById<T> {
  queryKey: string
  getById: (
    id: string,
    enabled?: boolean,
    refetchOnMount?: RefetchOnMount,
    refetchInterval?: number,
  ) => QueryOptions<T>
  stateGetById?: (id: string) => QueryState<T, Error> | undefined
}

/** Query that takes arbitrary params (e.g. date + vehicleType) to compute fee. */
export interface QueryGetByData<I, T> {
  queryKey: string
  getByData: (
    data: I,
    enabled?: boolean,
    refetchOnMount?: RefetchOnMount,
  ) => QueryOptions<T>
}

export interface MutationPostData<TVariables, TResponse> {
  mutationKey: string
  post: () => {
    mutationFn: (data: TVariables) => Promise<TResponse>
    mutationKey?: string[]
    onSuccess?: (data: TResponse, variables: TVariables) => void | Promise<void>
    onError?: (error: Error, variables: TVariables) => void | Promise<void>
    onSettled?: (
      data: TResponse | undefined,
      error: Error | null,
      variables: TVariables,
    ) => void | Promise<void>
  }
}
