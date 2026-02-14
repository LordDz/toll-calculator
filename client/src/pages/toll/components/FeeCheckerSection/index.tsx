import type { VehicleType } from '@/api/queries/toll'
import { apiToll } from '@/api/queries/toll'
import { Select } from '@/components/Input/Select'
import { TxtSectionTitle } from '@/components/text/Header'
import { toDatetimeLocal } from '@/utils/date/toDateTimeLocal'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { VEHICLE_OPTIONS } from '../constants'
import { FeeCost } from './FeeCost'

export const FeeCheckerSection = () => {
  const [checkDateTime, setCheckDateTime] = useState(() =>
    toDatetimeLocal(new Date().toISOString()),
  )
  const [checkVehicle, setCheckVehicle] = useState<VehicleType>('Car')

  const handleCheckDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckDateTime(e.target.value)
  }
  const handleCheckVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCheckVehicle(e.target.value as VehicleType)
  }

  const feeCheckParams =
    checkDateTime && checkVehicle
      ? {
          dateTime: new Date(checkDateTime).toISOString(),
          vehicleType: checkVehicle,
        }
      : null;
      
  const feeCheckQuery = useQuery({
    ...apiToll.getFeeCheck.getByData(
      feeCheckParams ?? { dateTime: '', vehicleType: 'Car' },
      !!feeCheckParams,
    ),
  })

  return (
    <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <TxtSectionTitle>Is this time fee-free?</TxtSectionTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-400">Date & time</span>
          <input
            type="datetime-local"
            value={checkDateTime}
            onChange={handleCheckDate}
            className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </label>
        <Select
          label="Vehicle"
          value={checkVehicle}
          onChange={handleCheckVehicle}
          options={VEHICLE_OPTIONS}
        />
      </div>
      {feeCheckQuery.data && <FeeCost data={feeCheckQuery.data} />}
    </section>
  )
}
