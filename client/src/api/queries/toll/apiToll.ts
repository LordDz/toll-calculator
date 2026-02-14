import { getQueryKey } from '@/api/queries/util/queryKey'
import { queryClient } from '@/api/queryClient/queryClient'
import { appendToQueryOnSuccess } from '@/api/utils/mutation/success'
import { TOLL_QUERY_KEYS } from './apiToll.constants'
import type { ApiToll, TollPassage } from './apiToll.types'
import {
  computeEffectiveFeeForDay,
  mockAddPassage,
  mockGetFeeForDateTime,
  mockGetFeeRules,
  mockGetPassages,
} from './mockTollData'

export const apiToll: ApiToll = {
  getPassages: {
    queryKey: TOLL_QUERY_KEYS.PASSAGES,
    get: (enabled = true, refetchOnMount = false) => ({
      queryKey: getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
      queryFn: () => mockGetPassages(),
      enabled,
      refetchOnMount,
    }),
  },

  getSekToday: {
    queryKey: TOLL_QUERY_KEYS.SEK_TODAY,
    getByData: (data, enabled = true, refetchOnMount = false) => ({
      queryKey: getQueryKey(TOLL_QUERY_KEYS.SEK_TODAY, data),
      queryFn: async () =>  computeEffectiveFeeForDay(await mockGetPassages(), new Date(data)),
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
    mutationKey: TOLL_QUERY_KEYS.POST_PASSAGE,
    post: () => ({
      mutationFn: (data) =>
        mockAddPassage(data.timestamp, data.vehicleType).then(
          ({ passage, dayTotalSek }) => ({ passage, dayTotalSek }),
        ),
      onSuccess: (data, variables) => {
        appendToQueryOnSuccess(
          getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
          data.passage,
          (a: TollPassage, b: TollPassage) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
        queryClient.invalidateQueries({
          queryKey: getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
        })
        queryClient.invalidateQueries({
          queryKey: getQueryKey(TOLL_QUERY_KEYS.SEK_TODAY, variables.timestamp),
        })
      },
    }),
  },
}
