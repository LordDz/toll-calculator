import type { VehicleType } from '@/api/queries/toll'
import { InputWithText } from '@/components/Input/InputWithText'
import { VehicleList } from '../VehicleList'

interface PassageFormProps {
  selectedTime: string
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  selectedVehicle: VehicleType
  onVehicleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onAddPassage: () => void
  isPending: boolean
}

export const PassageForm = ({
  selectedTime,
  onDateChange,
  selectedVehicle,
  onVehicleChange,
  onAddPassage,
  isPending,
}: PassageFormProps) => (
  <div className="flex flex-wrap gap-4 items-end">
    <InputWithText
      label="Date & time"
      type="datetime-local"
      value={selectedTime}
      onChange={onDateChange}
    />
    <VehicleList
      label="Vehicle"
      value={selectedVehicle}
      onChange={onVehicleChange}
      selectedDateTime={selectedTime}
    />
    <button
      onClick={onAddPassage}
      disabled={isPending}
      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
    >
      {isPending ? 'Adding…' : 'Add passage'}
    </button>
  </div>
)
