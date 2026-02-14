import { VEHICLE_OPTIONS } from '../../constants'
import type { VehicleListProps } from './index.types'

const inputClassName =
  'px-3 py-2 rounded-lg bg-white/90 border border-stone-300 text-text-primary focus:ring-2 focus:ring-button/30 focus:border-button min-w-[140px]'

const options = VEHICLE_OPTIONS.map((vehicleType) => ({
  value: vehicleType,
  label: vehicleType,
}))

export const VehicleList = ({
  label = 'Vehicle',
  value,
  onChange,
}: VehicleListProps) => {
  return (
    <label className="flex flex-col gap-1">
      {label && <span className="text-sm text-text-secondary">{label}</span>}
      <select
        value={value}
        onChange={onChange}
        className={inputClassName}
      >
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        ))}
      </select>
    </label>
  )
}
