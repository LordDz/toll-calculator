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
  {
    id: '1',
    timestamp: new Date().toISOString(),
    vehicleType: 'Car',
    feeSek: 18,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    vehicleType: 'Car',
    feeSek: 8,
  },
]

let nextId = 3

function isWeekend(date: Date): boolean {
  const d = date.getDay()
  return d === 0 || d === 6
}

/** Simplified: no real holiday list; could add one. */
function isHoliday(_date: Date): boolean {
  return false
}

function getHourFeeSek(date: Date): number {
  const h = date.getHours()
  const m = date.getMinutes()
  const totalMinutes = h * 60 + m
  // Rush hours: 6–9 and 15–17 (example) => 18 SEK; else 8 SEK
  const isRush =
    (totalMinutes >= 6 * 60 && totalMinutes < 9 * 60) ||
    (totalMinutes >= 15 * 60 && totalMinutes < 17 * 60)
  return isRush ? 18 : 8
}

/** Mock: get fee for a given date/time and vehicle. */
export function mockGetFeeForDateTime(
  dateTime: string,
  vehicleType: VehicleType,
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
  return { feeSek, isFree: false }
}

/** Mock: fetch all passages. */
export function mockGetPassages(): Promise<TollPassage[]> {
  return Promise.resolve([...mockPassages])
}

/** Mock: add a passage and return it with computed fee (stored in memory). */
export function mockAddPassage(
  timestamp: string,
  vehicleType: VehicleType,
): Promise<TollPassage> {
  const { feeSek } = mockGetFeeForDateTime(timestamp, vehicleType)
  const passage: TollPassage = {
    id: String(nextId++),
    timestamp,
    vehicleType,
    feeSek,
  }
  mockPassages.push(passage)
  return Promise.resolve(passage)
}

/** Mock: get fee rules summary for UI. */
export function mockGetFeeRules(): Promise<FeeRulesSummary> {
  return Promise.resolve({
    minFeeSek: 8,
    maxFeeSek: 18,
    maxPerDaySek: 60,
    freeVehicleTypes: [...FEE_FREE_VEHICLES],
    freeDays: 'weekends_and_holidays',
    chargeOncePerHour: true,
  })
}
