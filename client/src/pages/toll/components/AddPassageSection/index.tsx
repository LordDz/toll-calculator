import type { VehicleType } from '@/api/queries/toll'
import { apiToll } from '@/api/queries/toll'
import { isHoliday } from '@/api/queries/toll/mockTollData'
import { TxtSectionTitle } from '@/components/text/Header'
import { toDatetimeLocal } from '@/utils/date/toDateTimeLocal'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { PassagesListSection } from '../PassagesListSection'
import { FeeCost } from './FeeCost'
import { PassageForm } from './PassageForm'

export const AddPassageSection = () => {
  const [selectedTime, setSelectedTime] = useState(() =>
    toDatetimeLocal(new Date().toISOString()),
  )
  // const passagesQuery = useQuery(apiToll.getPassages.get())
  const qSekToday = useQuery(apiToll.getSekToday.getByData(selectedTime))

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Car')

  const addPassageMutation = useMutation(
    apiToll.postPassage.post(),
  )

  const handleAddPassage = () => {
    const timestamp = new Date(selectedTime).toISOString()
    addPassageMutation.mutate({ timestamp, vehicleType: selectedVehicle })
  }

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);

    const isTimeForParty = isHoliday(new Date(e.target.value));
    if (isTimeForParty) {
      toast.success('It is holiday time Woo!! 🎉')
    }
  }
  const handleChangeVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        selectedVehicle={selectedVehicle}
        onDateChange={handleChangeDate}
        onVehicleChange={handleChangeVehicle}
        onAddPassage={handleAddPassage}
        isPending={addPassageMutation.isPending}
      />
      {qSekToday.data != undefined && (
        <p className="mt-2 text-sm text-text-secondary">
          Day total (once/hour, max 60 SEK): <span className="font-medium text-text-primary">{qSekToday.data} SEK</span>
        </p>
      )}

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
