import type { FeeCheckFormProps } from './index.types'
import { InputWithText } from '@/components/Input/InputWithText'
import { Select } from '@/components/Input/Select'
import { VEHICLE_OPTIONS } from '../../constants'

export const FeeCheckForm = ({
  checkDateTime,
  onCheckDateChange,
  checkVehicle,
  onCheckVehicleChange,
}: FeeCheckFormProps) => (
  <div className="flex flex-wrap gap-4 items-end">
    <InputWithText
      label="Date & time"
      type="datetime-local"
      value={checkDateTime}
      onChange={onCheckDateChange}
    />
    <Select
      label="Vehicle"
      value={checkVehicle}
      onChange={onCheckVehicleChange}
      options={VEHICLE_OPTIONS}
    />
  </div>
)
