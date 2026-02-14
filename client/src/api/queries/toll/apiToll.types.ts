import type {
  MutationPostData,
  QueryGet,
  QueryGetByData,
} from '@/api/queries/types/fetchRequest.types'

/** Vehicle types; some are fee-free per requirements. */
export type VehicleType =
  | 'Car'
  | 'Motorcycle'
  | 'Tractor'
  | 'Emergency'
  | 'Bus'
  | 'Diplomat'
  | 'Military'
  | 'Foreign'

/** Single toll passage record (time, vehicle, fee). */
export interface TollPassage {
  id: string
  timestamp: string // ISO date-time
  vehicleType: VehicleType
  feeSek: number
}

/** Params to check fee for a given time (and optionally vehicle). */
export interface FeeCheckParams {
  dateTime: string // ISO date-time
  vehicleType: VehicleType
}

/** Result of fee check: amount and whether it's free. */
export interface FeeCheckResult {
  feeSek: number
  isFree: boolean
  reason?: string // e.g. "Weekend", "Holiday", "Emergency vehicle"
}

/** Summary of fee rules for the "how it works" UI. */
export interface FeeRulesSummary {
  minFeeSek: number
  maxFeeSek: number
  maxPerDaySek: number
  freeVehicleTypes: VehicleType[]
  freeDays: 'weekends' | 'weekends_and_holidays'
  chargeOncePerHour: boolean
}

/** Request to add a passage (mock backend returns the fee). */
export interface AddPassageRequest {
  timestamp: string
  vehicleType: VehicleType
}

/** Response after adding a passage. */
export interface AddPassageResponse {
  passage: TollPassage
  /** Effective day total: at most once per hour (max fee), cap 60 SEK. */
  dayTotalSek: number
}

export interface ApiToll {
  getPassages: QueryGet<TollPassage[]>
  getSekToday: QueryGetByData<string, number>
  getFeeCheck: QueryGetByData<FeeCheckParams, FeeCheckResult>
  getFeeRules: QueryGet<FeeRulesSummary>
  postPassage: MutationPostData<AddPassageRequest, AddPassageResponse>
}
