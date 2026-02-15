import { queryClient } from '@/api/queryClient/queryClient'
import { getQueryKey } from '@/api/queries/util/queryKey'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TOLL_QUERY_PASS_KEYS } from './apiToll.constants'
import type { AddPassageRequest, AddPassageResponse } from './apiToll.types'
import { getDayKey, onPostPassageSuccess } from './apiToll.utils'

vi.mock('@/api/queryClient/queryClient')

describe('getDayKey', () => {
  it('returns YYYY-MM-DD for an ISO timestamp (ignores time)', () => {
    expect(getDayKey('2025-02-15T10:00:00.000Z')).toBe('2025-02-15')
    expect(getDayKey('2025-02-15T14:30:00.000Z')).toBe('2025-02-15')
    expect(getDayKey('2025-12-01T12:00:00.000Z')).toBe('2025-12-01')
  })

  it('returns YYYY-MM-DD for a Date instance', () => {
    expect(getDayKey(new Date(2025, 1, 15, 14, 30))).toBe('2025-02-15')
    expect(getDayKey(new Date(2025, 11, 1))).toBe('2025-12-01')
  })

  it('pads month and day with leading zeros', () => {
    expect(getDayKey(new Date(2025, 0, 6))).toBe('2025-01-06')
    expect(getDayKey(new Date(2025, 8, 9))).toBe('2025-09-09')
  })
})

describe('onPostPassageSuccess', () => {
  const mockData: AddPassageResponse = {
    passage: {
      id: 'p1',
      timestamp: '2025-02-15T10:00:00.000Z',
      vehicleType: 'Car',
      feeSek: 22,
    },
    dayTotalSek: 22,
  }

  const mockVariables: AddPassageRequest = {
    timestamp: '2025-02-15T10:00:00.000Z',
    vehicleType: 'Car',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('invalidates passages and SEK_TODAY for that day (two invalidateQueries calls)', () => {
    onPostPassageSuccess(mockData, mockVariables)

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2)
    expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(1, {
      queryKey: getQueryKey(TOLL_QUERY_PASS_KEYS.PASSAGES),
    })
    expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(2, {
      queryKey: getQueryKey(TOLL_QUERY_PASS_KEYS.SEK_TODAY, getDayKey(mockVariables.timestamp)),
    })
  })
})
