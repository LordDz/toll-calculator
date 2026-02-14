import { apiToll } from '@/api/queries/toll'
import { useQueries } from '@tanstack/react-query'
import { useMemo } from 'react'
import { VEHICLE_OPTIONS } from '../../constants'
import type { VehicleListProps } from './index.types'

const inputClassName =
  'px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 min-w-[140px]'

export const VehicleList = ({
  label = 'Vehicle',
  value,
  onChange,
  selectedDateTime,
}: VehicleListProps) => {
  const dateTimeIso = selectedDateTime
    ? new Date(selectedDateTime).toISOString()
    : ''

  const feeQueries = useQueries({
    queries: VEHICLE_OPTIONS.map((vehicleType) =>
      apiToll.getFeeCheck.getByData(
        { dateTime: dateTimeIso, vehicleType },
        !!dateTimeIso,
      ),
    ),
  })

  const optionsWithFree = useMemo(() => {
    return VEHICLE_OPTIONS.map((vehicleType, i) => {
      const result = feeQueries[i].data
      const isFree = result?.isFree ?? false
      const label = isFree ? `${vehicleType} [FREE]` : vehicleType
      return { value: vehicleType, label }
    })
  }, [feeQueries])

  return (
    <label className="flex flex-col gap-1">
      {label && <span className="text-sm text-gray-400">{label}</span>}
      <select
        value={value}
        onChange={onChange}
        className={inputClassName}
      >
        {optionsWithFree.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        ))}
      </select>
    </label>
  )
}
