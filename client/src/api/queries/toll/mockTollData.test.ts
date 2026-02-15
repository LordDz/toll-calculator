import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __resetMockTollForTesting,
  computeEffectiveFeeForDay,
  getChargeableHoursMessage,
  getReasonIfNotWithinChargeableHours,
  isHoliday,
  mockAddPassage,
  mockGetFeeForDateTime,
  mockGetFeeRules,
  mockGetPassages,
} from './mockTollData'
import type { TollPassage } from './apiToll.types'

vi.mock('@/api/queryClient/queryClient', () => ({
  queryClient: {
    getQueryData: vi.fn(),
  },
}))

vi.mock('../util/queryKey', () => ({
  getQueryKey: vi.fn((key: string) => [key]),
}))

vi.mock('./apiToll', () => ({
  apiToll: {
    getPassages: { queryKey: 'PASSAGES' },
  },
}))

import { queryClient } from '@/api/queryClient/queryClient'

beforeEach(() => {
  __resetMockTollForTesting()
  vi.mocked(queryClient.getQueryData).mockReturnValue([])
})

describe('isHoliday', () => {
  it('returns true for fixed Swedish holidays', () => {
    expect(isHoliday(new Date(2025, 0, 1))).toBe(true)   // 1 Jan
    expect(isHoliday(new Date(2025, 0, 6))).toBe(true)   // 6 Jan – Epiphany
    expect(isHoliday(new Date(2025, 4, 1))).toBe(true)   // 1 May
    expect(isHoliday(new Date(2025, 5, 6))).toBe(true)   // 6 Jun – National Day
    expect(isHoliday(new Date(2025, 5, 20))).toBe(true)  // 20 Jun – Midsummer
    expect(isHoliday(new Date(2025, 10, 1))).toBe(true) // 1 Nov – All Saints
    expect(isHoliday(new Date(2025, 11, 25))).toBe(true) // 25 Dec
    expect(isHoliday(new Date(2025, 11, 26))).toBe(true) // 26 Dec
  })

  it('returns false for non-holiday dates', () => {
    expect(isHoliday(new Date(2025, 0, 2))).toBe(false)
    expect(isHoliday(new Date(2025, 2, 15))).toBe(false)
    expect(isHoliday(new Date(2025, 6, 14))).toBe(false)
  })

  it('returns true for Easter-based holidays in 2025', () => {
    // 2025: Good Friday 18 Apr, Easter Sunday 20 Apr, Easter Monday 21 Apr
    expect(isHoliday(new Date(2025, 3, 18))).toBe(true) // Good Friday
    expect(isHoliday(new Date(2025, 3, 19))).toBe(true) // Easter Eve
    expect(isHoliday(new Date(2025, 3, 20))).toBe(true) // Easter Sunday
    expect(isHoliday(new Date(2025, 3, 21))).toBe(true) // Easter Monday
    // Ascension 2025: 39 days after Easter Sunday = 29 May
    expect(isHoliday(new Date(2025, 4, 29))).toBe(true)
  })
})

describe('computeEffectiveFeeForDay', () => {
  it('returns 0 when there are no passages for the day', () => {
    const passages: TollPassage[] = [
      { id: '1', timestamp: '2025-02-10T08:00:00', vehicleType: 'Car', feeSek: 13 },
    ]
    expect(computeEffectiveFeeForDay(passages, new Date(2025, 1, 15))).toBe(0)
  })

  it('sums at most one fee per hour (highest in that hour)', () => {
    const passages: TollPassage[] = [
      { id: '1', timestamp: '2025-02-12T07:00:00', vehicleType: 'Car', feeSek: 18 },
      { id: '2', timestamp: '2025-02-12T07:30:00', vehicleType: 'Car', feeSek: 18 },
      { id: '3', timestamp: '2025-02-12T08:00:00', vehicleType: 'Car', feeSek: 13 },
    ]
    // Same day: 18 (hour 7) + 13 (hour 8) = 31
    expect(computeEffectiveFeeForDay(passages, new Date(2025, 1, 12))).toBe(31)
  })

  it('caps day total at 60 SEK', () => {
    const passages: TollPassage[] = [
      { id: '1', timestamp: '2025-02-12T07:00:00', vehicleType: 'Car', feeSek: 18 },
      { id: '2', timestamp: '2025-02-12T08:00:00', vehicleType: 'Car', feeSek: 18 },
      { id: '3', timestamp: '2025-02-12T09:30:00', vehicleType: 'Car', feeSek: 8 },
      { id: '4', timestamp: '2025-02-12T15:00:00', vehicleType: 'Car', feeSek: 18 },
      { id: '5', timestamp: '2025-02-12T16:00:00', vehicleType: 'Car', feeSek: 18 },
    ]
    // 18+18+8+18+18 = 80, capped to 60
    expect(computeEffectiveFeeForDay(passages, new Date(2025, 1, 12))).toBe(60)
  })
})

describe('getChargeableHoursMessage', () => {
  it('returns 24-hour message when use24Hour is true', () => {
    expect(getChargeableHoursMessage(true)).toBe('No charge between 06:00 and 18:30.')
  })

  it('returns 12-hour message when use24Hour is false', () => {
    expect(getChargeableHoursMessage(false)).toBe('No charge between 6:00 AM and 6:30 PM.')
  })
})

describe('getReasonIfNotWithinChargeableHours', () => {
  it('returns undefined when feeCost > 0', () => {
    expect(getReasonIfNotWithinChargeableHours(8)).toBeUndefined()
  })

  it('returns 24-hour message by default when feeCost is 0', () => {
    expect(getReasonIfNotWithinChargeableHours(0)).toBe('No charge between 06:00 and 18:30.')
  })

  it('returns 12-hour message when use24Hour is false and feeCost is 0', () => {
    expect(getReasonIfNotWithinChargeableHours(0, false)).toBe('No charge between 6:00 AM and 6:30 PM.')
  })
})

describe('mockGetFeeForDateTime', () => {
  it('returns fee for Car on a weekday in chargeable hours', () => {
    // Wednesday 12 Feb 2025, 07:00 – 18 SEK
    const result = mockGetFeeForDateTime('2025-02-12T07:00:00', 'Car')
    expect(result.isFree).toBe(false)
    expect(result.feeSek).toBe(18)
  })

  it('returns 0 and isFree for fee-free vehicle types', () => {
    const freeTypes = ['Emergency', 'Bus', 'Diplomat', 'Military', 'Foreign', 'Motorcycle'] as const
    for (const vehicleType of freeTypes) {
      const result = mockGetFeeForDateTime('2025-02-12T07:00:00', vehicleType)
      expect(result.isFree).toBe(true)
      expect(result.feeSek).toBe(0)
      expect(result.reason).toContain(vehicleType)
    }
  })

  it('returns 0 and isFree for weekend', () => {
    // Saturday 15 Feb 2025
    const result = mockGetFeeForDateTime('2025-02-15T08:00:00', 'Car')
    expect(result.isFree).toBe(true)
    expect(result.feeSek).toBe(0)
    expect(result.reason).toBe('Weekend')
  })

  it('returns 0 and isFree for holiday', () => {
    const result = mockGetFeeForDateTime('2025-01-01T08:00:00', 'Car')
    expect(result.isFree).toBe(true)
    expect(result.feeSek).toBe(0)
    expect(result.reason).toBe('Holiday')
  })

  it('returns 0 fee for time outside chargeable hours', () => {
    // Before 06:00
    const early = mockGetFeeForDateTime('2025-02-12T05:30:00', 'Car')
    expect(early.feeSek).toBe(0)
    expect(early.isFree).toBe(true)
    expect(early.reason).toBe('No charge between 06:00 and 18:30.')
    // After 18:30
    const late = mockGetFeeForDateTime('2025-02-12T19:00:00', 'Car')
    expect(late.feeSek).toBe(0)
    expect(late.isFree).toBe(true)
    expect(late.reason).toBe('No charge between 06:00 and 18:30.')
  })

  it('returns reason in 12-hour format when use24Hour is false', () => {
    const early = mockGetFeeForDateTime('2025-02-12T05:30:00', 'Car', false)
    expect(early.reason).toBe('No charge between 6:00 AM and 6:30 PM.')
  })

  it('returns correct fees for different time slots', () => {
    // Low (8), Standard (13), Rush (18)
    expect(mockGetFeeForDateTime('2025-02-12T06:00:00', 'Car').feeSek).toBe(8)   // 06:00–06:29 Low
    expect(mockGetFeeForDateTime('2025-02-12T06:30:00', 'Car').feeSek).toBe(13)  // 06:30–06:59 Standard
    expect(mockGetFeeForDateTime('2025-02-12T07:00:00', 'Car').feeSek).toBe(18)  // 07:00–07:59 Rush
    expect(mockGetFeeForDateTime('2025-02-12T07:30:00', 'Car').feeSek).toBe(18)
    expect(mockGetFeeForDateTime('2025-02-12T08:00:00', 'Car').feeSek).toBe(13)  // 08:00–08:29 Standard
    expect(mockGetFeeForDateTime('2025-02-12T08:29:00', 'Car').feeSek).toBe(13)
    expect(mockGetFeeForDateTime('2025-02-12T08:30:00', 'Car').feeSek).toBe(8)  // 08:30–14:59 Low
    expect(mockGetFeeForDateTime('2025-02-12T10:00:00', 'Car').feeSek).toBe(8)
    expect(mockGetFeeForDateTime('2025-02-12T14:59:00', 'Car').feeSek).toBe(8)
    expect(mockGetFeeForDateTime('2025-02-12T15:00:00', 'Car').feeSek).toBe(13)  // 15:00–15:29 Standard
    expect(mockGetFeeForDateTime('2025-02-12T15:30:00', 'Car').feeSek).toBe(18) // 15:30–16:59 Rush
    expect(mockGetFeeForDateTime('2025-02-12T16:59:00', 'Car').feeSek).toBe(18)
    expect(mockGetFeeForDateTime('2025-02-12T17:00:00', 'Car').feeSek).toBe(13) // 17:00–17:59 Standard
    expect(mockGetFeeForDateTime('2025-02-12T18:00:00', 'Car').feeSek).toBe(8)  // 18:00–18:29 Low
    expect(mockGetFeeForDateTime('2025-02-12T18:29:00', 'Car').feeSek).toBe(8)
  })
})

describe('mockGetPassages', () => {
  it('returns a copy of in-memory passages', async () => {
    const first = await mockGetPassages()
    expect(first).toEqual([])
    // After mockAddPassage, passages will include the new one (tested in mockAddPassage)
  })
})

describe('mockAddPassage', () => {
  it('returns passage and dayTotalSek for Car on weekday', async () => {
    const { passage, dayTotalSek } = await mockAddPassage('2025-02-12T07:00:00', 'Car')
    expect(passage.vehicleType).toBe('Car')
    expect(passage.timestamp).toBe('2025-02-12T07:00:00')
    expect(passage.feeSek).toBe(18)
    expect(passage.id).toBeDefined()
    // dayTotalSek is the day total from passages already in the cache (before this one)
    expect(dayTotalSek).toBe(0)
  })

  it('returns fee 0 for fee-free vehicle', async () => {
    const { passage, dayTotalSek } = await mockAddPassage('2025-02-12T07:00:00', 'Emergency')
    expect(passage.feeSek).toBe(0)
    expect(dayTotalSek).toBe(0)
  })

  it('caps new passage fee when day total would exceed 60', async () => {
    vi.mocked(queryClient.getQueryData).mockReturnValue([
      { id: '1', timestamp: '2025-02-12T07:00:00', vehicleType: 'Car', feeSek: 18 },
      { id: '2', timestamp: '2025-02-12T08:00:00', vehicleType: 'Car', feeSek: 18 },
      { id: '3', timestamp: '2025-02-12T09:30:00', vehicleType: 'Car', feeSek: 8 },
      { id: '4', timestamp: '2025-02-12T15:00:00', vehicleType: 'Car', feeSek: 18 },
    ] as TollPassage[])
    // Day total so far: 18+18+8+18 = 62 → but effective is capped per hour so actually 18+18+8+18 = 62, cap 60. So effective is 60.
    // Adding another 18 at 16:00: room left = 0, so passage fee should be 0
    const { passage, dayTotalSek } = await mockAddPassage('2025-02-12T16:00:00', 'Car')
    expect(passage.feeSek).toBe(0)
    expect(dayTotalSek).toBe(60)
  })

  it('adds passage to mock store so mockGetPassages returns it', async () => {
    await mockAddPassage('2025-02-12T08:00:00', 'Car')
    const passages = await mockGetPassages()
    expect(passages).toHaveLength(1)
    expect(passages[0].vehicleType).toBe('Car')
    expect(passages[0].timestamp).toBe('2025-02-12T08:00:00')
  })
})

describe('mockGetFeeRules', () => {
  it('returns correct fee rules summary', async () => {
    const rules = await mockGetFeeRules()
    expect(rules.minFeeSek).toBe(8)
    expect(rules.maxFeeSek).toBe(18)
    expect(rules.maxPerDaySek).toBe(60)
    expect(rules.freeDays).toBe('weekends_and_holidays')
    expect(rules.chargeOncePerHour).toBe(true)
    expect(rules.freeVehicleTypes).toContain('Emergency')
    expect(rules.freeVehicleTypes).toContain('Bus')
    expect(rules.freeVehicleTypes).toContain('Motorcycle')
  })
})
