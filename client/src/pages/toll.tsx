import type { VehicleType } from '@/api/queries/toll'
import { apiToll, TOLL_QUERY_KEYS } from '@/api/queries/toll'
import { getQueryKey } from '@/api/queries/util/queryKey'
import { PageTitle, SectionTitle } from '@/components/text/header'
import { formatDateTime } from '@/utils/date/formatDateTime'
import { toDatetimeLocal } from '@/utils/date/toDateTimeLocal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const VEHICLE_OPTIONS: VehicleType[] = [
  'Car',
  'Motorcycle',
  'Tractor',
  'Emergency',
  'Bus',
  'Diplomat',
  'Military',
  'Foreign',
]

export const TollPage = () => {
  const queryClient = useQueryClient()

  const [checkDateTime, setCheckDateTime] = useState(() =>
    toDatetimeLocal(new Date().toISOString()),
  )
  const [checkVehicle, setCheckVehicle] = useState<VehicleType>('Car')
  const [addDateTime, setAddDateTime] = useState(() =>
    toDatetimeLocal(new Date().toISOString()),
  )
  const [addVehicle, setAddVehicle] = useState<VehicleType>('Car')

  const passagesQuery = useQuery(apiToll.getPassages.get())
  const rulesQuery = useQuery(apiToll.getFeeRules.get())
  const feeCheckParams =
    checkDateTime && checkVehicle
      ? {
          dateTime: new Date(checkDateTime).toISOString(),
          vehicleType: checkVehicle,
        }
      : null
  const feeCheckQuery = useQuery({
    ...apiToll.getFeeCheck.getByData(
      feeCheckParams ?? { dateTime: '', vehicleType: 'Car' },
      !!feeCheckParams,
    ),
  })

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
    addPassageMutation.mutate({ timestamp, vehicleType: addVehicle })
  }

  return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PageTitle>Toll fee calculator</PageTitle>
        <p className="text-gray-400 mb-8">
          Check fees, view passages, and add entries. Mock backend for demo.
        </p>

        <div className="grid gap-6">
          {/* Fee checker */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SectionTitle>Is this time fee-free?</SectionTitle>
            <div className="flex flex-wrap gap-4 items-end">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Date & time</span>
                <input
                  type="datetime-local"
                  value={checkDateTime}
                  onChange={(e) => setCheckDateTime(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Vehicle</span>
                <select
                  value={checkVehicle}
                  onChange={(e) => setCheckVehicle(e.target.value as VehicleType)}
                  className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
                >
                  {VEHICLE_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {feeCheckQuery.data && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  feeCheckQuery.data.isFree
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-500/20 border border-amber-500/50 text-amber-200'
                }`}
              >
                {feeCheckQuery.data.isFree ? (
                  <>
                    <span className="font-semibold">Fee-free</span>
                    {feeCheckQuery.data.reason && (
                      <span className="ml-2">— {feeCheckQuery.data.reason}</span>
                    )}
                  </>
                ) : (
                  <span className="font-semibold">
                    Fee: {feeCheckQuery.data.feeSek} SEK
                  </span>
                )}
              </div>
            )}
          </section>

          {/* Add passage */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SectionTitle>Add toll passage</SectionTitle>
            <div className="flex flex-wrap gap-4 items-end">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Date & time</span>
                <input
                  type="datetime-local"
                  value={addDateTime}
                  onChange={(e) => setAddDateTime(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-400">Vehicle</span>
                <select
                  value={addVehicle}
                  onChange={(e) => setAddVehicle(e.target.value as VehicleType)}
                  className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:ring-2 focus:ring-cyan-500 min-w-[140px]"
                >
                  {VEHICLE_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={handleAddPassage}
                disabled={addPassageMutation.isPending}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {addPassageMutation.isPending ? 'Adding…' : 'Add passage'}
              </button>
            </div>
            {addPassageMutation.isSuccess && (
              <p className="mt-3 text-sm text-cyan-400">
                Added: {addPassageMutation.data.passage.feeSek} SEK at{' '}
                {formatDateTime(addPassageMutation.data.passage.timestamp)}
              </p>
            )}
          </section>

          {/* Passages list */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SectionTitle>Your toll passages</SectionTitle>
            {passagesQuery.isLoading && (
              <p className="text-gray-400">Loading…</p>
            )}
            {passagesQuery.isError && (
              <p className="text-red-400">
                Error: {passagesQuery.error?.message}
              </p>
            )}
            {passagesQuery.data && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-600 text-gray-400 text-sm">
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Vehicle</th>
                      <th className="py-2">Fee (SEK)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passagesQuery.data.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-slate-700/80 hover:bg-slate-700/30"
                      >
                        <td className="py-3 pr-4 text-gray-300">
                          {formatDateTime(p.timestamp)}
                        </td>
                        <td className="py-3 pr-4">{p.vehicleType}</td>
                        <td className="py-3">
                          {p.feeSek === 0 ? (
                            <span className="text-emerald-400">Free</span>
                          ) : (
                            <span className="font-medium">{p.feeSek}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {passagesQuery.data.length === 0 && (
                  <p className="text-gray-500 py-4">No passages yet.</p>
                )}
              </div>
            )}
          </section>

          {/* How it works */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <SectionTitle>How the toll system works</SectionTitle>
            {rulesQuery.isLoading && (
              <p className="text-gray-400">Loading rules…</p>
            )}
            {rulesQuery.data && (
              <ul className="space-y-2 text-gray-300">
                <li>
                  Fee between <strong className="text-white">{rulesQuery.data.minFeeSek}</strong> and{' '}
                  <strong className="text-white">{rulesQuery.data.maxFeeSek} SEK</strong> depending on time of day.
                </li>
                <li>
                  Maximum <strong className="text-white">{rulesQuery.data.maxPerDaySek} SEK</strong> per day.
                </li>
                <li>
                  Charged at most once per hour; highest fee applies if multiple passages in the same hour.
                </li>
                <li>
                  Fee-free: weekends and holidays.
                </li>
                <li>
                  Fee-free vehicle types:{' '}
                  <span className="text-cyan-300">
                    {rulesQuery.data.freeVehicleTypes.join(', ')}
                  </span>
                </li>
              </ul>
            )}
          </section>
        </div>
      </div>
  )
}
