import type { VehicleType } from '@/api/queries/toll'
import { apiToll, TOLL_QUERY_KEYS } from '@/api/queries/toll'
import { getQueryKey } from '@/api/queries/util/queryKey'
import { queryClient } from '@/api/queryClient/queryClient'
import { InputWithText } from '@/components/Input/InputWithText'
import { Select } from '@/components/Input/Select'
import { TxtSectionTitle } from '@/components/text/Header'
import { TxtParagraph } from '@/components/text/Paragraph'
import { formatDateTime } from '@/utils/date/formatDateTime'
import { toDatetimeLocal } from '@/utils/date/toDateTimeLocal'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { VEHICLE_OPTIONS } from '../constants'

export const AddPassageSection = () => {
  const [addDateTime, setAddDateTime] = useState(() =>
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
    const timestamp = new Date(addDateTime).toISOString()
    addPassageMutation.mutate({ timestamp, vehicleType: selectedVehicle })
  }

  const handleAddDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddDateTime(e.target.value)
  }
  const handleAddVehicle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVehicle(e.target.value as VehicleType)
  }

  return (
    <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <TxtSectionTitle>Add toll passage</TxtSectionTitle>
      <div className="flex flex-wrap gap-4 items-end">
        <InputWithText
          label="Date & time"
          type="datetime-local"
          value={addDateTime}
          onChange={handleAddDate}
        />
        <Select
          label="Vehicle"
          value={selectedVehicle}
          onChange={handleAddVehicle}
          options={VEHICLE_OPTIONS}
        />
        <button
          onClick={handleAddPassage}
          disabled={addPassageMutation.isPending}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {addPassageMutation.isPending ? 'Adding…' : 'Add passage'}
        </button>
      </div>
      {addPassageMutation.isSuccess && addPassageMutation.data && (
        <TxtParagraph className="mt-3 text-sm text-cyan-400">
          Added: {addPassageMutation.data.passage.feeSek} SEK at{' '}
          {formatDateTime(addPassageMutation.data.passage.timestamp)}
        </TxtParagraph>
      )}
    </section>
  )
}
