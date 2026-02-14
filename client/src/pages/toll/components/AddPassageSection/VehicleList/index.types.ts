import type { VehicleType } from '@/api/queries/toll'

export type VehicleListProps = {
  label?: string
  value: VehicleType
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}
