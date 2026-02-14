import type { AddPassageRequest, AddPassageResponse, VehicleType } from '@/api/queries/toll'
import { apiToll } from '@/api/queries/toll'
import { getQueryKey } from '@/api/queries/util/queryKey'
import { queryClient } from '@/api/queryClient/queryClient'
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
  // const passagesQuery = useQuery(apiToll.getPassages.get())
  const qSekToday = useQuery(apiToll.getSekToday.getByData(selectedTime))

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Car')

  const addPassageMutation = useMutation(
    apiToll.postPassage.post(),
  )

  const onSuccess = (successData: AddPassageResponse, variables: AddPassageRequest) => {
    console.log('!!!!!onSuccess mutation', successData, variables)
    queryClient.invalidateQueries({ queryKey: getQueryKey(apiToll.getSekToday.queryKey) })
  }



  const handleAddPassage = () => {
    const timestamp = new Date(selectedTime).toISOString()
    addPassageMutation.mutate({ timestamp, vehicleType: selectedVehicle }, { onSuccess })
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

  // const dayTotalSek =
  //   passagesQuery.data?.length != null && passagesQuery.data.length > 0
  //     ? computeEffectiveFeeForDay(passagesQuery.data, new Date())
  //     : null;

      // console.log('dayTotalSek', dayTotalSek)
      // console.log('passagesQuery.data', passagesQuery.data)

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
