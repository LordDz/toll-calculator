import { queryClient } from '@/api/queryClient/queryClient'
import { appendToQueryOnSuccess } from '@/api/utils/mutation/success'
import { getQueryKey } from '../util/queryKey'
import { TOLL_QUERY_KEYS } from './apiToll.constants'
import type {
  AddPassageRequest,
  AddPassageResponse,
  TollPassage,
} from './apiToll.types'

/** Normalize a date/time to a day-only key (YYYY-MM-DD) for cache keys. */
export function getDayKey(dateOrIso: Date | string): string {
  const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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
    queryKey: getQueryKey(TOLL_QUERY_KEYS.SEK_TODAY, getDayKey(variables.timestamp)),
  })
}
