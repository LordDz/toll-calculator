import { getQueryKey } from '@/api/queries/util/queryKey'
import { queryClient } from '@/api/queryClient/queryClient'
import { appendToQueryOnSuccess } from '@/api/utils/mutation/success'
import { TOLL_QUERY_KEYS } from './apiToll.constants'
import type {
  AddPassageRequest,
  AddPassageResponse,
  TollPassage,
} from './apiToll.types'

const passageSortByTimestamp = (a: TollPassage, b: TollPassage) =>
  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()

/** Called when postPassage mutation succeeds; updates cache and invalidates related queries. */
export function onPostPassageSuccess(
  data: AddPassageResponse,
  variables: AddPassageRequest,
): void {
  appendToQueryOnSuccess(
    getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
    data.passage,
    passageSortByTimestamp,
  )
  queryClient.invalidateQueries({
    queryKey: getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
  })
  queryClient.invalidateQueries({
    queryKey: getQueryKey(TOLL_QUERY_KEYS.SEK_TODAY, variables.timestamp),
  })
}
