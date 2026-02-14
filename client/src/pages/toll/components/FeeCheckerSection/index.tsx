import type { VehicleType } from '@/api/queries/toll'
import { apiToll } from '@/api/queries/toll'
import { QueryWrapper } from '@/components/QueryWrapper/QueryWrapper'
import { TxtSectionTitle } from '@/components/text/Header'
import { toDatetimeLocal } from '@/utils/date/toDateTimeLocal'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FeeCheckForm } from './FeeCheckForm'
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
      <FeeCheckForm
        checkDateTime={checkDateTime}
        checkVehicle={checkVehicle}
        onCheckDateChange={handleCheckDate}
        onCheckVehicleChange={handleCheckVehicle}
      />
      {feeCheckParams && (
        <QueryWrapper query={feeCheckQuery}>
          {(data) => <FeeCost data={data} />}
        </QueryWrapper>
      )}
    </section>
  )
}
