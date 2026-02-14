import type { VehicleType } from '@/api/queries/toll'

export type VehicleListProps = {
  label?: string
  value: VehicleType
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  /** datetime-local string; used to show [FREE] for vehicles free at this time */
  selectedDateTime: string
}
