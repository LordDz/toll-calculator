import { queryClient } from '@/api/queryClient/queryClient'
import { getQueryKey } from '../util/queryKey'
import { apiToll } from './apiToll'
import type { FeeCheckResult, FeeRulesSummary, TollPassage, VehicleType } from './apiToll.types'

/** Fee-free vehicle types per requirements. */
const FEE_FREE_VEHICLES: VehicleType[] = [
  'Emergency',
  'Bus',
  'Diplomat',
  'Military',
  'Foreign',
  'Motorcycle', // often exempt in real systems; add/remove as needed
]

/** Mock in-memory passages (would be replaced by real API). */
let mockPassages: TollPassage[] = [
  
]

let nextId = 3

function isWeekend(date: Date): boolean {
  const d = date.getDay()
  return d === 0 || d === 6
}

/**
 * Easter Sunday for a given year (Gregorian calendar).
 * Uses the Anonymous Gregorian algorithm; variable names (a–m) follow the standard formulation.
 */
function getEasterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

/** Maximum toll per day (SEK). */
const MAX_DAILY_FEE_SEK = 60

/** Swedish public holidays (red days). */
export function isHoliday(date: Date): boolean {
  const y = date.getFullYear()
  const m = date.getMonth()
  const d = date.getDate()

  // Fixed dates: (month 0-indexed, day 1-indexed)
  if (m === 0 && d === 1) return true   // 1 Jan – New Year's Day
  if (m === 0 && d === 6) return true   // 6 Jan – Epiphany
  if (m === 4 && d === 1) return true   // 1 May – May Day
  if (m === 5 && d === 6) return true   // 6 Jun – Sweden's National Day
  if (m === 5 && d === 20) return true  // 20 Jun – Midsummer Day
  if (m === 10 && d === 1) return true  // 1 Nov – All Saints' Day
  if (m === 11 && d === 25) return true // 25 Dec – Christmas Day
  if (m === 11 && d === 26) return true // 26 Dec – St. Stephen's Day (Boxing Day)

  // Traditional days off, such as Christmas Eve, New Year's Eve and Midsummer Eve, 
  // are not official public holidays by law but are often non-working days through collective agreements.
  // Easter-based (Good Friday, Easter Eve, Easter Sunday, Easter Monday, Ascension Day)
  const easter = getEasterSunday(y)
  const goodFriday = new Date(easter)
  goodFriday.setDate(easter.getDate() - 2)
  const easterEve = new Date(easter)
  easterEve.setDate(easter.getDate() - 1)
  const easterMonday = new Date(easter)
  easterMonday.setDate(easter.getDate() + 1)
  const ascension = new Date(easter)
  ascension.setDate(easter.getDate() + 39)

  if (isSameDay(date, goodFriday)) return true
  if (isSameDay(date, easterEve)) return true
  if (isSameDay(date, easter)) return true
  if (isSameDay(date, easterMonday)) return true
  if (isSameDay(date, ascension)) return true

  return false
}

/** Minutes from midnight for readable schedule (e.g. M(6,0) = 06:00). */
const M = (h: number, min: number) => h * 60 + min

/**
 * Fee schedule as time ranges (minutes from midnight, inclusive). Only chargeable
 * times are listed; all other times (e.g. 18:30–05:59) return 0.
 * Low=8, Standard=13, Rush=18 SEK.
 */
const FEE_SCHEDULE: ReadonlyArray<{ startMinOfDay: number; endMinOfDay: number; feeSek: number }> = [
  { startMinOfDay: M(6, 0), endMinOfDay: M(6, 29), feeSek: 8 },   // 06:00–06:29 Low
  { startMinOfDay: M(6, 30), endMinOfDay: M(6, 59), feeSek: 13 },  // 06:30–06:59 Standard
  { startMinOfDay: M(7, 0), endMinOfDay: M(7, 59), feeSek: 18 },   // 07:00–07:59 Rush
  { startMinOfDay: M(8, 0), endMinOfDay: M(8, 29), feeSek: 13 },   // 08:00–08:29 Standard
  { startMinOfDay: M(8, 30), endMinOfDay: M(14, 59), feeSek: 8 }, // 08:30–14:59 Low
  { startMinOfDay: M(15, 0), endMinOfDay: M(15, 29), feeSek: 13 }, // 15:00–15:29 Standard
  { startMinOfDay: M(15, 30), endMinOfDay: M(16, 59), feeSek: 18 }, // 15:30–16:59 Rush
  { startMinOfDay: M(17, 0), endMinOfDay: M(17, 59), feeSek: 13 }, // 17:00–17:59 Standard
  { startMinOfDay: M(18, 0), endMinOfDay: M(18, 29), feeSek: 8 },  // 18:00–18:29 Low
]

/** Returns the toll fee (SEK) for the given date/time, or 0 if outside chargeable hours. */
function getHourFeeSek(date: Date): number {
  const minOfDay = date.getHours() * 60 + date.getMinutes()
  const match = FEE_SCHEDULE.find(
    (slot) => minOfDay >= slot.startMinOfDay && minOfDay <= slot.endMinOfDay,
  )
  return match?.feeSek ?? 0
}

/** Same calendar day (date only). */
function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function getDayHourKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = date.getHours()
  return `${y}-${m}-${d}-${h}`
}

/**
 * Effective fee for a day: charged at most once per hour (highest fee in that hour),
 * maximum 60 SEK per day.
 */
export function computeEffectiveFeeForDay(
  passages: TollPassage[],
  dayDate: Date,
): number {
  const dayPassages = passages.filter((p) =>
    isSameDay(new Date(p.timestamp), dayDate),
  )
  const byHour = new Map<string, number>()
  for (const p of dayPassages) {
    const key = getDayHourKey(new Date(p.timestamp))
    const current = byHour.get(key) ?? 0
    byHour.set(key, Math.max(current, p.feeSek))
  }
  const sum = [...byHour.values()].reduce((a, b) => a + b, 0)
  return Math.min(sum, MAX_DAILY_FEE_SEK)
}

/** Mock: get fee for a given date/time and vehicle. */
export function mockGetFeeForDateTime(
  dateTime: string,
  vehicleType: VehicleType,
  use24Hour: boolean = true,
): FeeCheckResult {
  const date = new Date(dateTime)
  if (FEE_FREE_VEHICLES.includes(vehicleType)) {
    return { feeSek: 0, isFree: true, reason: `Vehicle type "${vehicleType}" is fee-free` }
  }
  if (isWeekend(date)) {
    return { feeSek: 0, isFree: true, reason: 'Weekend' }
  }
  if (isHoliday(date)) {
    return { feeSek: 0, isFree: true, reason: 'Holiday' }
  }
  const feeSek = getHourFeeSek(date)
  return { feeSek, isFree: feeSek === 0, reason: getReasonIfNotWithinChargeableHours(feeSek, use24Hour) }
}

/**
 * Returns the "no charge outside hours" message in 12-hour or 24-hour format.
 * Use this so the message respects the user's time format preference.
 */
export function getChargeableHoursMessage(use24Hour: boolean): string {
  if (use24Hour) {
    return 'No charge between 06:00 and 18:30.'
  }
  return 'No charge between 6:00 AM and 6:30 PM.'
}

export function getReasonIfNotWithinChargeableHours(
  feeCost: number,
  use24Hour: boolean = true,
): string | undefined {
  if (feeCost === 0) {
    return getChargeableHoursMessage(use24Hour)
  }
  return undefined
}

/** Mock: fetch all passages (sorted by date, oldest first). */
export function mockGetPassages(): Promise<TollPassage[]> {
  const sorted = [...mockPassages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
  return Promise.resolve(sorted)
}

const getApiPassages = () => {
  return queryClient.getQueryData<TollPassage[]>(getQueryKey(apiToll.getPassages.queryKey))
}

/**
 * Fee for this passage respecting the daily cap: if adding this fee would exceed
 * the cap, only the remaining amount up to the cap is charged.
 */
function capFeeToDailyMaximum(feeSek: number, dayTotalSoFarSek: number): number {
  const roomLeft = MAX_DAILY_FEE_SEK - dayTotalSoFarSek
  return Math.min(feeSek, Math.max(0, roomLeft))
}

/** Mock: add a passage and return it with computed fee (stored in memory). */
export function mockAddPassage(
  timestamp: string,
  vehicleType: VehicleType,
): Promise<{ passage: TollPassage; dayTotalSek: number }> {
  const currentPassages = getApiPassages() ?? []
  const { feeSek } = mockGetFeeForDateTime(timestamp, vehicleType)
  const dayTotalSek = computeEffectiveFeeForDay(currentPassages, new Date(timestamp))

  const passageFeeSek = capFeeToDailyMaximum(feeSek, dayTotalSek)

  const passage: TollPassage = {
    id: String(nextId++),
    timestamp,
    vehicleType,
    feeSek: passageFeeSek,
  }
  mockPassages.push(passage)
  setApiPassagesToHighestWithinHour(passage)

  return Promise.resolve({ passage, dayTotalSek })
}

/**
 * Within the same calendar hour and vehicle type, only the passage with the
 * highest fee is charged; all others in that hour/type are set to 0.
 */
function setApiPassagesToHighestWithinHour(passage: TollPassage): void {
  const hourKey = getDayHourKey(new Date(passage.timestamp))
  const sameHourSameType = mockPassages.filter(
    (p) =>
      p.vehicleType === passage.vehicleType &&
      getDayHourKey(new Date(p.timestamp)) === hourKey,
  )
  const maxFee = Math.max(...sameHourSameType.map((p) => p.feeSek))
  const passageWithMaxFee = sameHourSameType.find((p) => p.feeSek === maxFee)!

  for (const p of sameHourSameType) {
    p.feeSek = p === passageWithMaxFee ? maxFee : 0
  }
}

/** Mock: get fee rules summary for UI. */
export function mockGetFeeRules(): Promise<FeeRulesSummary> {
  return Promise.resolve({
    minFeeSek: 8,
    maxFeeSek: 18,
    maxPerDaySek: MAX_DAILY_FEE_SEK,
    freeVehicleTypes: [...FEE_FREE_VEHICLES],
    freeDays: 'weekends_and_holidays',
    chargeOncePerHour: true,
  })
}

/** Reset in-memory passages and id counter. Only for tests. */
export function __resetMockTollForTesting(): void {
  mockPassages = []
  nextId = 3
}
