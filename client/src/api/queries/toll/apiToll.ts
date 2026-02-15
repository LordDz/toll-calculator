import { getQueryKey } from '@/api/queries/util/queryKey'
import { TOLL_MUTATION_KEYS, TOLL_QUERY_KEYS, TOLL_QUERY_PASS_KEYS } from './apiToll.constants'
import type { ApiToll } from './apiToll.types'
import { getDayKey, onPostPassageSuccess } from './apiToll.utils'
import {
  computeEffectiveFeeForDay,
  mockAddPassage,
  mockGetFeeForDateTime,
  mockGetFeeRules,
  mockGetPassages,
} from './mockTollData'

export const apiToll: ApiToll = {
  getPassages: {
    queryKey: TOLL_QUERY_PASS_KEYS.PASSAGES,
    get: (enabled = true, refetchOnMount = false) => ({
      queryKey: getQueryKey(TOLL_QUERY_PASS_KEYS.PASSAGES),
      queryFn: () => mockGetPassages(),
      enabled,
      refetchOnMount,
    }),
  },

  getSekToday: {
    queryKey: TOLL_QUERY_PASS_KEYS.SEK_TODAY,
    getByData: (data, enabled = true, refetchOnMount = false) => ({
      queryKey: getQueryKey(TOLL_QUERY_PASS_KEYS.SEK_TODAY, getDayKey(data)),
      queryFn: async () => computeEffectiveFeeForDay(await mockGetPassages(), new Date(data)),
      enabled,
      refetchOnMount,
    }),
  },
  getFeeCheck: {
    queryKey: TOLL_QUERY_KEYS.FEE_CHECK,
    getByData: (data, enabled = true, refetchOnMount = false) => ({
      queryKey: getQueryKey(TOLL_QUERY_KEYS.FEE_CHECK, data.dateTime, data.vehicleType),
      queryFn: () =>
        Promise.resolve(mockGetFeeForDateTime(data.dateTime, data.vehicleType)),
      enabled: enabled && !!data.dateTime && !!data.vehicleType,
      refetchOnMount,
    }),
  },

  getFeeRules: {
    queryKey: TOLL_QUERY_KEYS.FEE_RULES,
    get: (enabled = true, refetchOnMount = false) => ({
      queryKey: getQueryKey(TOLL_QUERY_KEYS.FEE_RULES),
      queryFn: () => mockGetFeeRules(),
      enabled,
      refetchOnMount,
    }),
  },

  postPassage: {
    mutationKey: TOLL_MUTATION_KEYS.POST_PASSAGE,
    post: () => ({
      mutationFn: (data) =>
        mockAddPassage(data.timestamp, data.vehicleType).then(
          ({ passage, dayTotalSek }) => ({ passage, dayTotalSek }),
        ),
      onSuccess: onPostPassageSuccess,
    }),
  },
}
