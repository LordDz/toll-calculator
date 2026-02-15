import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getDayKey, onPostPassageSuccess } from './apiToll.utils'
import { appendToQueryOnSuccess } from '@/api/utils/mutation/success'
import { queryClient } from '@/api/queryClient/queryClient'
import { getQueryKey } from '@/api/queries/util/queryKey'
import { TOLL_QUERY_KEYS } from './apiToll.constants'
import type { AddPassageRequest, AddPassageResponse } from './apiToll.types'

vi.mock('@/api/utils/mutation/success')
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

  it('appends the new passage to the passages query cache with timestamp sort', () => {
    onPostPassageSuccess(mockData, mockVariables)

    expect(appendToQueryOnSuccess).toHaveBeenCalledTimes(1)
    expect(appendToQueryOnSuccess).toHaveBeenCalledWith(
      getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
      mockData.passage,
      expect.any(Function),
    )
    const compareFn = (appendToQueryOnSuccess as ReturnType<typeof vi.fn>).mock
      .calls[0][2] as (a: typeof mockData.passage, b: typeof mockData.passage) => number
    expect(compareFn(mockData.passage, { ...mockData.passage, timestamp: '2025-02-14T09:00:00.000Z' })).toBeGreaterThan(0)
    expect(compareFn(mockData.passage, { ...mockData.passage, timestamp: '2025-02-16T11:00:00.000Z' })).toBeLessThan(0)
  })

  it('invalidates the passages query', () => {
    onPostPassageSuccess(mockData, mockVariables)

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
    })
  })

  it('invalidates the SEK_TODAY query by day key (not by minute)', () => {
    onPostPassageSuccess(mockData, mockVariables)

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: getQueryKey(TOLL_QUERY_KEYS.SEK_TODAY, getDayKey(mockVariables.timestamp)),
    })
  })

  it('calls invalidateQueries twice (passages and sekToday)', () => {
    onPostPassageSuccess(mockData, mockVariables)

    expect(queryClient.invalidateQueries).toHaveBeenCalledTimes(2)
  })
})
