import type { VehicleType } from '@/api/queries/toll'

export type PassageFormProps = {
  selectedTime: string
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedVehicle: VehicleType
  onVehicleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onAddPassage: () => void
  isPending: boolean
}
