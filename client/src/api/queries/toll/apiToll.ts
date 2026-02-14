import { getQueryKey } from '@/api/queries/util/queryKey'
import { appendToQueryOnSuccess } from '@/api/utils/mutation/success'
import { TOLL_QUERY_KEYS } from './apiToll.constants'
import type { ApiToll, TollPassage } from './apiToll.types'
import {
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
        mockAddPassage(data.timestamp, data.vehicleType).then((passage) => ({
          passage,
        })),
      onSuccess: (data) => {
        appendToQueryOnSuccess(
          getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
          data.passage,
          (a: TollPassage, b: TollPassage) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        )
      },
    }),
  },
}
