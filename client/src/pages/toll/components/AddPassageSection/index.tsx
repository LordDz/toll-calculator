import type { VehicleType } from '@/api/queries/toll'
import { apiToll } from '@/api/queries/toll'
import { TxtSectionTitle } from '@/components/text/Header'
import { toDatetimeLocal } from '@/utils/date/toDateTimeLocal'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { PassagesListSection } from '../PassagesListSection'
import { FeeCost } from './FeeCost'
import { PassageForm } from './PassageForm'

export const AddPassageSection = () => {
  const [selectedTime, setSelectedTime] = useState(() =>
    toDatetimeLocal(new Date().toISOString()),
  )
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Car')

  const addPassageMutation = useMutation(
    apiToll.postPassage.post(),
  )

  const handleAddPassage = () => {
    const timestamp = new Date(selectedTime).toISOString()
    addPassageMutation.mutate({ timestamp, vehicleType: selectedVehicle })
  }

  const handleAddDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value)
  }
  const handleAddVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicle(e.target.value as VehicleType)
  }
  const feeCheckParams =
  selectedTime && selectedVehicle
    ? {
        dateTime: new Date(selectedTime).toISOString(),
        vehicleType: selectedVehicle,
      }
    : null;
    
const feeCheckQuery = useQuery({
  ...apiToll.getFeeCheck.getByData(
    feeCheckParams ?? { dateTime: '', vehicleType: 'Car' },
    !!feeCheckParams,
  ),
})

  return (
    <section className="bg-toll-section rounded-xl p-6">
      <TxtSectionTitle>Add toll passage</TxtSectionTitle>
      <PassageForm
        selectedTime={selectedTime}
        onDateChange={handleAddDate}
        selectedVehicle={selectedVehicle}
        onVehicleChange={handleAddVehicle}
        onAddPassage={handleAddPassage}
        isPending={addPassageMutation.isPending}
      />

      {/* {feeCheckParams && (
        <QueryWrapper query={feeCheckQuery} messageClassName="text-text-secondary">
          {(_data) => null}
        </QueryWrapper>
      )} */}
      <FeeCost data={feeCheckQuery.data} />
      <PassagesListSection />
 
    </section>
  )
}
