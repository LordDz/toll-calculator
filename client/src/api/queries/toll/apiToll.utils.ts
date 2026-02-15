import { queryClient } from '@/api/queryClient/queryClient'
import { getQueryKey } from '../util/queryKey'
import { TOLL_QUERY_PASS_KEYS } from './apiToll.constants'
import type {
  AddPassageRequest,
  AddPassageResponse,
  FeeCheckResult,
  TollPassage,
  VehicleType,
} from './apiToll.types'

/** Normalize a date/time to a day-only key (YYYY-MM-DD) for cache keys. */
export function getDayKey(dateOrIso: Date | string): string {
  const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Same hour (day + hour) key for once-per-hour rule. */
export function getDayHourKey(dateOrIso: Date | string): string {
  const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso
  const h = d.getHours()
  return `${getDayKey(d)}-${h}`
}

/**
 * Effective fee check for display: if there's already a passage in the same hour
 * with a higher fee (so adding this one would be free), return isFree with reason.
 */
export function getEffectiveFeeCheckForDisplay(
  feeCheckResult: FeeCheckResult | undefined,
  passages: TollPassage[],
  dateTime: string,
  vehicleType: VehicleType,
): FeeCheckResult | undefined {
  if (feeCheckResult === undefined || feeCheckResult.isFree) return feeCheckResult
  const hourKey = getDayHourKey(dateTime)
  const sameHourSameType = passages.filter(
    (p) =>
      p.vehicleType === vehicleType && getDayHourKey(p.timestamp) === hourKey,
  )
  const hasHigherOrEqual = sameHourSameType.some(
    (p) => p.feeSek >= feeCheckResult.feeSek,
  )
  if (hasHigherOrEqual) {
    return {
      ...feeCheckResult,
      isFree: true,
      reason: 'Entry exists in the same hour so no charge will be applied.',
    }
  }
  return feeCheckResult
}

/** Called when postPassage mutation succeeds; invalidates related queries. */
export function onPostPassageSuccess(
  _data: AddPassageResponse,
  variables: AddPassageRequest,
): void {
  queryClient.invalidateQueries({
    queryKey: getQueryKey(TOLL_QUERY_PASS_KEYS.PASSAGES),
  })
  queryClient.invalidateQueries({
    queryKey: getQueryKey(TOLL_QUERY_PASS_KEYS.SEK_TODAY, getDayKey(variables.timestamp)),
  })
}
