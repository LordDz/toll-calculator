import { InputWithText } from '@/components/Input/InputWithText'
import { VehicleList } from '../VehicleList'
import type { PassageFormProps } from './index.types'

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
      labelClassName="text-sm text-text-secondary"
      className="px-3 py-2 rounded-lg bg-white/90 border border-stone-300 text-text-primary focus:ring-2 focus:ring-button/30 focus:border-button"
    />
    <VehicleList
      label="Vehicle"
      value={selectedVehicle}
      onChange={onVehicleChange}
    />
    <button
      onClick={onAddPassage}
      disabled={isPending}
      className="px-4 py-2 rounded-lg bg-button text-text-on-button hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors cursor-pointer"
    >
      {isPending ? 'Adding…' : 'Add passage'}
    </button>
  </div>
)
