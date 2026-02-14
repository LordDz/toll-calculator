import type { VehicleType } from '@/api/queries/toll'
import { apiToll, TOLL_QUERY_KEYS } from '@/api/queries/toll'
import { getQueryKey } from '@/api/queries/util/queryKey'
import { queryClient } from '@/api/queryClient/queryClient'
import { InputWithText } from '@/components/Input/InputWithText'
import { QueryWrapper } from '@/components/QueryWrapper'
import { TxtSectionTitle } from '@/components/text/Header'
import { TxtParagraph } from '@/components/text/Paragraph'
import { formatDateTime } from '@/utils/date/formatDateTime'
import { toDatetimeLocal } from '@/utils/date/toDateTimeLocal'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { FeeCost } from './FeeCost'
import { VehicleList } from './VehicleList'

export const AddPassageSection = () => {
  const [selectedTime, setSelectedTime] = useState(() =>
    toDatetimeLocal(new Date().toISOString()),
  )
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('Car')

  const addPassageMutation = useMutation({
    ...apiToll.postPassage.post(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getQueryKey(TOLL_QUERY_KEYS.PASSAGES),
      })
    },
  })

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
    <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <TxtSectionTitle>Add toll passage</TxtSectionTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <InputWithText
          label="Date & time"
          type="datetime-local"
          value={selectedTime}
          onChange={handleAddDate}
        />
        <VehicleList
          label="Vehicle"
          value={selectedVehicle}
          onChange={handleAddVehicle}
          selectedDateTime={selectedTime}
        />
        <button
          onClick={handleAddPassage}
          disabled={addPassageMutation.isPending}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {addPassageMutation.isPending ? 'Adding…' : 'Add passage'}
        </button>
      </div>

      {feeCheckParams && (
        <QueryWrapper query={feeCheckQuery}>
          {(data) => <FeeCost data={data} />}
        </QueryWrapper>
      )}
      {addPassageMutation.isSuccess && addPassageMutation.data && (
        <TxtParagraph className="mt-3 text-sm text-cyan-400">
          Added: {addPassageMutation.data.passage.feeSek} SEK at{' '}
          {formatDateTime(addPassageMutation.data.passage.timestamp)}
        </TxtParagraph>
      )}
    </section>
  )
}
